#!/bin/sh
# Runs once, on the first initialization of a new Postgres data directory.
# Strapi gets its own login role and database; the role is not a cluster
# superuser.
set -eu

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  --set=strapi_user="$STRAPI_DATABASE_USERNAME" \
  --set=strapi_password="$STRAPI_DATABASE_PASSWORD" \
  --set=strapi_db="$STRAPI_DATABASE_NAME" <<-'EOSQL'
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'strapi_user', :'strapi_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'strapi_user') \gexec

SELECT format('CREATE DATABASE %I OWNER %I', :'strapi_db', :'strapi_user')
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'strapi_db') \gexec
EOSQL

echo "[init] Strapi role and database are ready"
