FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat \
  && corepack enable pnpm
WORKDIR /app

FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/frontend/package.json ./apps/frontend/
RUN pnpm install --frozen-lockfile --prod=false

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/frontend/node_modules ./apps/frontend/node_modules
COPY . .
WORKDIR /app/apps/frontend
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME="0.0.0.0"
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nextjs /app/apps/frontend/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=build --chown=nextjs:nextjs /app/apps/frontend/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "apps/frontend/server.js"]
