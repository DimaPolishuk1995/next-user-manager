FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache bash && corepack enable

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm exec ts-node prisma/merge-schema.ts \
 && pnpm exec prisma generate --schema=prisma/schema.prisma \
 && pnpm run build

RUN chmod +x docker-entrypoint.sh

ENV NODE_ENV=production PORT=3001

EXPOSE 3001
CMD ["./docker-entrypoint.sh"]
