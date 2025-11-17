FROM oven/bun:1 AS build
WORKDIR /app

RUN apk add --no-cache \
    build-base \
    vips-dev \
    pkgconfig

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun --bun run build

FROM oven/bun:1 AS production
WORKDIR /app

RUN apk add --no-cache \
    vips
    # vips tanpa '-dev'

COPY --from=build /app/.output /app

EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "--bun", "run", "/app/server/index.mjs" ]
