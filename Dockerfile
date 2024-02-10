# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.18.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"
ENV NITRO_PRESET="bun"

# Install bun
# (Uses 1.0.18: https://github.com/oven-sh/bun/issues/7864)
RUN apt-get update -qq && apt-get install -y curl unzip
RUN curl -fsSL https://bun.sh/install | bash -s "bun-v1.0.18"

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get install -y build-essential pkg-config python-is-python3

COPY . ./

# Install node modules
COPY --link .npmrc package.json bun.lockb ./
RUN ~/.bun/bin/bun install

# Build application
RUN ~/.bun/bin/bun run build


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app/.output ./

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "~/.bun/bin/bun", "run", "/app/server/index.mjs" ]
