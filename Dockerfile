# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.9.0
FROM node:${NODE_VERSION}-slim as base
# FROM oven/bun:slim as base

LABEL fly_launch_runtime="Node.js"
# LABEL fly_launch_runtime="Bun"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"
# ENV NITRO_PRESET="bun"

RUN npm install -g bun@latest

# Throw-away build stage to reduce size of final image
FROM base as build

COPY . ./

# Install node modules
COPY --link package.json bun.lockb ./

RUN bun i --frozen-lockfile

# Build application
RUN bun run build

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app/.output ./

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
# CMD [ "bun", "run", "/app/server/index.mjs" ]
CMD [ "node", "/app/server/index.mjs" ]
