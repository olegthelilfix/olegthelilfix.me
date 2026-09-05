#!/bin/sh
# Runs on the Hetzner host. The GHCR token is read from stdin and is never
# written to the release directory or the server environment file.
set -eu

die() {
  echo "deploy error: $*" >&2
  exit 1
}

[ "$#" -eq 7 ] || die "expected: RELEASE_SHA MODE DEPLOY_ROOT WEB_IMAGE CMS_IMAGE ARCHIVE REGISTRY_USER"

release_sha=$1
deploy_mode=$2
deploy_root=$3
web_image=$4
cms_image=$5
release_archive=$6
registry_user=$7

case "$release_sha" in
  ''|*[!0-9a-f]*) die "release SHA must contain lowercase hexadecimal characters only" ;;
esac
[ "${#release_sha}" -ge 7 ] && [ "${#release_sha}" -le 64 ] || die "invalid release SHA length"

case "$deploy_mode" in
  bootstrap|production) ;;
  *) die "mode must be bootstrap or production" ;;
esac

case "$deploy_root" in
  /*) ;;
  *) die "deploy root must be an absolute path" ;;
esac
case "$deploy_root" in
  *[!A-Za-z0-9_./-]*) die "deploy root contains unsupported characters" ;;
esac
case "$web_image:$cms_image" in
  *[!a-z0-9_./:-]*) die "container image name contains unsupported characters" ;;
esac
case "$web_image:$cms_image" in
  ghcr.io/*:ghcr.io/*) ;;
  *) die "both application images must come from ghcr.io" ;;
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
shared_dir="$deploy_root/shared"
release_dir="$releases_dir/$release_sha"
environment_file="$shared_dir/.env"
compose_file="$release_dir/docker-compose.yml"
bootstrap_file="$release_dir/docker-compose.bootstrap.yml"

install -d -m 0750 "$deploy_root" "$releases_dir" "$shared_dir" "$release_dir"
tar -xzf "$release_archive" -C "$release_dir"

[ -f "$compose_file" ] || die "docker-compose.yml is missing from the release"
[ -f "$bootstrap_file" ] || die "bootstrap Compose file is missing from the release"
[ -x "$release_dir/scripts/generate-production-env.sh" ] || die "environment generator is missing"

if [ ! -s "$environment_file" ]; then
  if [ "$deploy_mode" != bootstrap ]; then
    die "$environment_file does not exist; run the bootstrap deployment first"
  fi
  "$release_dir/scripts/generate-production-env.sh" "$environment_file"
fi
chmod 0600 "$environment_file"
ln -sfn "$environment_file" "$release_dir/.env"

if [ "$deploy_mode" = bootstrap ] && [ -L "$deploy_root/current" ]; then
  die "bootstrap has already completed; use production mode"
fi

printf '%s\n' "$registry_token" \
  | docker login ghcr.io --username "$registry_user" --password-stdin >/dev/null
registry_logged_in=true
unset registry_token

compose() {
  WEB_IMAGE="$web_image" CMS_IMAGE="$cms_image" IMAGE_TAG="$release_sha" \
    docker compose --env-file "$environment_file" -f "$compose_file" "$@"
}

bootstrap_compose() {
  WEB_IMAGE="$web_image" CMS_IMAGE="$cms_image" IMAGE_TAG="$release_sha" \
    docker compose --env-file "$environment_file" \
      -f "$compose_file" -f "$bootstrap_file" "$@"
}

if [ "$deploy_mode" = bootstrap ]; then
  bootstrap_compose config --quiet
  bootstrap_compose pull cms
  bootstrap_compose up -d --no-build --wait --wait-timeout 300 db cms
  bootstrap_compose ps
else
  compose config --quiet
  compose pull web cms
  compose up -d --no-build --remove-orphans --wait --wait-timeout 300
  compose ps
fi

cat > "$release_dir/deployment.env" <<EOF
RELEASE_SHA=$release_sha
DEPLOY_MODE=$deploy_mode
WEB_IMAGE=$web_image
CMS_IMAGE=$cms_image
EOF
chmod 0640 "$release_dir/deployment.env"
ln -sfn "$release_dir" "$deploy_root/current"

echo "Deployment completed: $deploy_mode ($release_sha)"
