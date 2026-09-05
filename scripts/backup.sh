#!/bin/sh
# Online backup for the production Compose stack. The target directory contains
# a Postgres logical dump plus the Strapi uploads and n8n runtime data.
set -eu

umask 077
backup_root=${BACKUP_DIR:-./backups}
backup_timestamp=$(date -u +%Y%m%dT%H%M%SZ)
backup_target="$backup_root/$backup_timestamp"

mkdir -p "$backup_target"

echo "Backing up Postgres..."
docker compose exec -T db sh -c 'pg_dumpall --clean --if-exists --username "$POSTGRES_USER"' \
  | gzip -9 > "$backup_target/postgres.sql.gz"

echo "Backing up Strapi uploads..."
docker compose exec -T cms tar -C /opt/app/public -czf - uploads \
  > "$backup_target/cms-uploads.tar.gz"

echo "Backing up n8n runtime data..."
docker compose exec -T n8n tar -C /home/node -czf - .n8n \
  > "$backup_target/n8n-data.tar.gz"

gzip -t "$backup_target/postgres.sql.gz"
tar -tzf "$backup_target/cms-uploads.tar.gz" >/dev/null
tar -tzf "$backup_target/n8n-data.tar.gz" >/dev/null

if command -v sha256sum >/dev/null 2>&1; then
  (cd "$backup_target" && sha256sum ./*.gz > SHA256SUMS)
else
  (cd "$backup_target" && shasum -a 256 ./*.gz > SHA256SUMS)
fi

echo "Backup created and verified: $backup_target"
echo "Store a separate encrypted copy of .env; it is required to decrypt n8n credentials."
