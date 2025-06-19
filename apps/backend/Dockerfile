FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache bash && corepack enable

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/backend/prisma ./prisma
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter backend exec ts-node prisma/merge-schema.ts
RUN pnpm --filter backend exec prisma generate --schema=prisma/schema.prisma
RUN pnpm --filter backend run build

COPY apps/backend/docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

ENV NODE_ENV=production PORT=3001 \
    DATABASE_URL="mysql://root:root@db:3306/next_user_manager"

EXPOSE 3001
CMD ["./docker-entrypoint.sh"]
