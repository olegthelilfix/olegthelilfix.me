#!/bin/sh
# Generate a new production env file without printing secrets to the terminal.
# Refuses to overwrite an existing file.
set -eu

target_file=${1:-.env}
deploy_email=${ACME_EMAIL:-hello@olegthelilfix.me}

if [ -e "$target_file" ]; then
  echo "Refusing to overwrite existing $target_file" >&2
  exit 1
fi

command -v openssl >/dev/null 2>&1 || {
  echo "openssl is required" >&2
  exit 1
}

umask 077
app_key_1=$(openssl rand -base64 16)
app_key_2=$(openssl rand -base64 16)
app_key_3=$(openssl rand -base64 16)
app_key_4=$(openssl rand -base64 16)

{
  echo "ACME_EMAIL=$deploy_email"
  echo "POSTGRES_ADMIN_USERNAME=postgres"
  echo "POSTGRES_ADMIN_PASSWORD=$(openssl rand -hex 24)"
  echo "STRAPI_DATABASE_NAME=strapi"
  echo "STRAPI_DATABASE_USERNAME=strapi"
  echo "STRAPI_DATABASE_PASSWORD=$(openssl rand -hex 24)"
  echo "APP_KEYS=$app_key_1,$app_key_2,$app_key_3,$app_key_4"
  echo "API_TOKEN_SALT=$(openssl rand -base64 32)"
  echo "ADMIN_JWT_SECRET=$(openssl rand -base64 32)"
  echo "TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)"
  echo "JWT_SECRET=$(openssl rand -base64 32)"
  echo "ENCRYPTION_KEY=$(openssl rand -base64 32)"
  echo "MCP_ACCESS_TOKEN=$(openssl rand -hex 32)"
  echo "STRAPI_API_TOKEN="
  echo "MCP_WRITE_ENABLED=false"
} > "$target_file"

echo "Created $target_file with mode 600"
