#!/bin/sh
# Runs once, on the first initialization of a new Postgres data directory.
# Each application gets its own login role and database; neither role is a
# cluster superuser and a compromise cannot directly access the other app DB.
set -eu

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  --set=strapi_user="$STRAPI_DATABASE_USERNAME" \
  --set=strapi_password="$STRAPI_DATABASE_PASSWORD" \
  --set=strapi_db="$STRAPI_DATABASE_NAME" \
  --set=n8n_user="$N8N_DATABASE_USERNAME" \
  --set=n8n_password="$N8N_DATABASE_PASSWORD" \
  --set=n8n_db="$N8N_DATABASE_NAME" <<-'EOSQL'
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'strapi_user', :'strapi_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'strapi_user') \gexec

SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'n8n_user', :'n8n_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'n8n_user') \gexec

SELECT format('CREATE DATABASE %I OWNER %I', :'strapi_db', :'strapi_user')
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'strapi_db') \gexec

SELECT format('CREATE DATABASE %I OWNER %I', :'n8n_db', :'n8n_user')
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'n8n_db') \gexec
EOSQL

echo "[init] application roles and databases are ready"
