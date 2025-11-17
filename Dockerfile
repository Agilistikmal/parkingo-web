FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile --ignore-scripts

RUN bun install --frozen-lockfile

COPY . .

FROM oven/bun:1 AS production

WORKDIR /app

COPY --from=build /app/.output /app

EXPOSE 3000/tcp

ENTRYPOINT [ "bun", "--bun", "run", "/app/server/index.mjs" ]
