# --- CMS (Strapi 5) production image -----------------------------------------
# Debian slim base so native deps (better-sqlite3, sharp) install cleanly.
# Build stage compiles the admin panel; runner serves it against Postgres.

FROM node:26-slim AS build
WORKDIR /opt/app
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:26-slim AS runner
WORKDIR /opt/app
ENV NODE_ENV=production
ENV HOME=/home/node
# All config comes from the environment (compose); no baked .env.
COPY --from=build --chown=node:node /opt/app ./
RUN mkdir -p public/uploads && chown -R node:node public/uploads
USER node
EXPOSE 1337
CMD ["npm", "run", "start"]
