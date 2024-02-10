# syntax = docker/dockerfile:1

ARG BUN_VERSION=latest
FROM oven/bun:${BUN_VERSION} as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"
ENV NITRO_PRESET="bun"

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3

COPY . ./

# Install node modules
COPY --link .npmrc package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Build application
RUN bun run build


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app/.output ./

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "bun", "run", "/app/server/index.mjs" ]
