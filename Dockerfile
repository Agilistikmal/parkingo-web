# Step 1: Build with Bun
FROM oven/bun:1.0.25 as builder

WORKDIR /app

COPY . .

RUN bun install
RUN bun add ofetch

# Build Nuxt (SSR output will be in .output)
RUN bun run build

# Step 2: Production runner
FROM oven/bun:1.0.25

WORKDIR /app

COPY --from=builder /app/.output .output
COPY --from=builder /app/package.json .
COPY --from=builder /app/bun.lockb .

RUN bun install --production

EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]
