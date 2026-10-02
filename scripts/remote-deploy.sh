#!/bin/sh
# Runs on the Hetzner host. The GHCR token is read from stdin and is never
# written to disk.
set -eu

die() {
  echo "deploy error: $*" >&2
  exit 1
}

[ "$#" -eq 5 ] || die "expected: RELEASE_SHA DEPLOY_ROOT WEB_IMAGE ARCHIVE REGISTRY_USER"

release_sha=$1
deploy_root=$2
web_image=$3
release_archive=$4
registry_user=$5

case "$release_sha" in
  ''|*[!0-9a-f]*) die "release SHA must contain lowercase hexadecimal characters only" ;;
esac
[ "${#release_sha}" -ge 7 ] && [ "${#release_sha}" -le 64 ] || die "invalid release SHA length"

case "$deploy_root" in
  /*) ;;
  *) die "deploy root must be an absolute path" ;;
esac
case "$deploy_root" in
  *[!A-Za-z0-9_./-]*) die "deploy root contains unsupported characters" ;;
esac
case "$web_image" in
  ghcr.io/*) ;;
  *) die "the website image must come from ghcr.io" ;;
esac
case "$web_image" in
  *[!a-z0-9_./:-]*) die "container image name contains unsupported characters" ;;
esac
case "$registry_user" in
  ''|*[!A-Za-z0-9_-]*) die "invalid registry username" ;;
esac

expected_archive="/tmp/olegthelilfix-release-$release_sha.tar.gz"
[ "$release_archive" = "$expected_archive" ] || die "unexpected release archive path"
[ -f "$release_archive" ] || die "release archive is missing"

registry_logged_in=false
cleanup() {
  if [ "$registry_logged_in" = true ]; then
    docker logout ghcr.io >/dev/null 2>&1 || true
  fi
  rm -f "$expected_archive"
  case "$0" in
    /tmp/olegthelilfix-remote-deploy-*.sh) rm -f "$0" ;;
  esac
}
trap cleanup EXIT HUP INT TERM

IFS= read -r registry_token || die "could not read the GHCR token from stdin"
[ -n "$registry_token" ] || die "the GHCR token is empty"

releases_dir="$deploy_root/releases"
release_dir="$releases_dir/$release_sha"
compose_file="$release_dir/docker-compose.yml"

install -d -m 0750 "$deploy_root" "$releases_dir" "$release_dir"
tar -xzf "$release_archive" -C "$release_dir"

[ -f "$compose_file" ] || die "docker-compose.yml is missing from the release"
[ -f "$release_dir/Caddyfile" ] || die "Caddyfile is missing from the release"

printf '%s\n' "$registry_token" \
  | docker login ghcr.io --username "$registry_user" --password-stdin >/dev/null
registry_logged_in=true
unset registry_token

compose() {
  WEB_IMAGE="$web_image" IMAGE_TAG="$release_sha" \
    docker compose -f "$compose_file" "$@"
}

compose config --quiet
compose pull web caddy
# --remove-orphans removes the retired Strapi, MCP and Postgres containers from
# the old stack. Their named volumes are deliberately preserved for rollback.
compose up -d --no-build --remove-orphans --wait --wait-timeout 180
compose ps

cat > "$release_dir/deployment.env" <<EOF
RELEASE_SHA=$release_sha
WEB_IMAGE=$web_image
EOF
chmod 0640 "$release_dir/deployment.env"
ln -sfn "$release_dir" "$deploy_root/current"

echo "Deployment completed: $release_sha"
