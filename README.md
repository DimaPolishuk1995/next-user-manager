# Next User-Manager

> **Project toolset:** A full‑stack, users CRUD platform built with **Next.js 15**, **NestJS 11**, **Prisma 6**, **MySQL
8**, and **Tailwind 4 / shadcn‑ui**.
---

## Table of Contents

1. [High-Level Overview](#high-level-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Monorepo Layout](#monorepo-layout)
5. [Environment Variables](#environment-variables)
6. [Running the Project](#running-the-project)
    * [Docker Compose](#docker-compose)
    * [Local Mode](#local-mode)
7. [Database & Prisma](#database--prisma)
    * [Schema & Migrations](#schema--migrations)
    * [Seed Data](#seed-data)
    * [Useful Prisma Commands](#useful-prisma-commands)
8. [Frontend](#frontend)
9. [Backend](#backend)
10. [Adding shadcn-ui Components](#adding-shadcn-ui-components)
12. [Deployment Notes](#deployment-notes)
12. [Demo Assets](#demo-assets)

---

## High-Level Overview

The application lets you **create, read, update, delete, bulk-import and purge users**. It supports **server-side
pagination & sorting**, shadcn UI, form validation with **Zod**, and API introspection via **Swagger**.

### Architectural View

```
+-------------+      HTTP/JSON       +-------------+
|  Next.js    |  --->  /api/*  --->  |  NestJS API |
|  (frontend) |  <---             ---|             |
+-------------+                    +------+--------+
        ^                                 |
        | React Query cache               v
+-------+------+  mysql native  +------------------+
|  React UI    |--------------->|    MySQL 8.4     |
+--------------+               +------------------+
```

---

## Features

| Category        | Capability                                                                     |
|-----------------|--------------------------------------------------------------------------------|
| **CRUD**        | Create / edit / delete single user, delete all                                 |
| **Bulk import** | Upload `.xlsx` / `.xls` -> server parses via `xlsx` library                    |
| **Pagination**  | Server-side page/size parameters (default 10)                                  |
| **Sorting**     | Clickable column headers, multi-column ready                                   |
| **Validation**  | Frontend: **Zod** schemas + React Hook Form; Backend: **class-validator** DTOs |
| **API Docs**    | `/docs` – Swagger UI auto-generated                                            |
| **CI-friendly** | Deterministic pnpm lockfile, Dockerfiles per app                               |

## Tech Stack

### Frontend

* **Next.js 15 App Router** – React 19, Server/Client components
* **Tailwind 4** with `tw-animate-css` and `tailwind-merge`
* **shadcn-ui** primitives (Dialog, Table, Button ...)
* **TanStack React Query 5**
* **Zod + RHF** forms

### Backend

* **NestJS 11** with global validation pipe
* **Prisma 6** – MySQL datasource
* **Swagger** docs (`@nestjs/swagger`)
* **XLSX** parser for import

### Tooling

* **pnpm workspaces**
* ESLint 9 + Prettier 3, strict TS
* **Docker Compose**

---

## Monorepo Layout (`tree -L 2`)

```
.
├── apps/
│   ├── backend/   # NestJS service  (port 3001)
│   └── frontend/  # Next.js app     (port 3000)
├── docker-compose.yml
├── .env           # root env for compose
└── pnpm-workspace.yaml
```

---

## Environment Variables

### 1 · Root `.env` (used by Docker Compose)

```bash
FRONTEND_PORT=3000
BACKEND_PORT=3001

DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASS=root
DB_NAME=next_user_manager
MYSQL_ROOT_PASSWORD=root
DATABASE_URL="mysql://root:root@db:3306/next_user_manager"

NEXT_PUBLIC_FRONTEND_URL="http://localhost:${FRONTEND_PORT}"
NEXT_PUBLIC_API_URL="http://localhost:${BACKEND_PORT}"
API_BASE_URL="http://backend:${BACKEND_PORT}"
```

### 2 · `apps/frontend/.env`

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
API_BASE_URL=http://backend:3001
```

### 3 · `apps/backend/.env` (fallback)

```bash
DATABASE_URL="mysql://root:root@localhost:3306/mydb"
```

---

## Running the Project

### Docker Compose

```bash
pnpm dev           # builds & starts db, backend, frontend
pnpm dev:detach    # same but detached (-d)

# Stop & remove containers + volume
echo y | pnpm down
```

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:3001/api](http://localhost:3001/api)
* Swagger docs: [http://localhost:3001/docs](http://localhost:3001/docs)

### Local Mode

Run each piece separately:

```bash
# 1. Database – Docker or local MySQL 8.x
mysql -u root -p -e "CREATE DATABASE next_user_manager;"

# 2. Backend
cd apps/backend
pnpm i
DATABASE_URL="mysql://root:root@localhost:3306/next_user_manager" pnpm run db:dev
pnpm run start:dev

# 3. Frontend
cd ../frontend
pnpm i
pnpm run dev
```

---

## Database & Prisma

### Schema & Migrations

Located in `apps/backend/prisma/` – split into mini schemas then merged (`prisma/merge-schema.ts`).

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  email     String   @unique @db.VarChar(120)
  createdAt DateTime @default(now())
}
```

### Useful Prisma Commands

| Script                      | Purpose                                                |
|-----------------------------|--------------------------------------------------------|
| `pnpm run prisma:merge`     | Merge modular \*.prisma into `schema.prisma`           |
| `pnpm run db:dev`           | Dev workflow: reset -> migrate dev -> seed -> generate |
| `pnpm run db:deploy`        | Production workflow: merge -> `prisma migrate deploy`  |
| `pnpm run prisma:generated` | Regenerate client without migrations                   |

### Seed Data

*File:* `apps/backend/prisma/seed.ts`

```ts
await prisma.user.createMany({
    skipDuplicates: true,
    data: [ /* 15 demo users */]
});
```

---

## Frontend

* **App Router** (`src/app`) with server actions for data prefetch (SSR). Hydration via `HydrationBoundary` + React
  Query cache.
* **State Management:** React Query provides cache invalidation after mutations.
* **UI patterns:** container / presentational split (`modules/UsersPageContainer.tsx`).
* **Accessibility:** Dialogs trap focus; all interactive elements have focus states.

#### Key Files

* `src/app/page.tsx` – root users page (ISR, revalidate 60 s)
* `src/components/UsersTable/*` – table with sorting & pagination
* `src/hooks/usePaginatedUsers.ts` – data hook with prefetch logic

---

## Backend

* **Global pipes:** `ValidationPipe({ transform: true, whitelist: true })` prevents unknown payload keys.
* **DTOs:** `src/modules/users/dto` – mapped with `@nestjs/mapped-types` for update.
* **Service Layer:** encapsulates Prisma calls.
* **File Import:** POST `/users/import` (multipart), parses sheet rows into DTOs, then bulk create.

---

## Adding shadcn-ui Components

The repo is bootstrapped for shadcn. To add more primitives:

```bash
pnpm dlx shadcn@latest add button dialog table form toast
```

Components are placed in `src/components/ui/*` and Tailwind config is updated automatically.

---

## Demo Assets (placeholders)

| Type       | Path                                                | Notes           |
|------------|-----------------------------------------------------|-----------------|
| Screenshot | ![Main Users Page](docs/images/main-view.png)       | Main Users page |
| Screencast | ![Create User](docs/images/create-user.png)         | Create User     |
| Screencast | ![Edit User](docs/images/edit-user.png)             | Edit User       |
| Screencast | ![Delete User](docs/images/delete-user.png)         | Delete User     |
| Screencast | ![Delete ALL](docs/images/delete-all.png)           | Delete ALL      |
| Screencast | ![Sorting](docs/images/sorting.png)                 | Sorting         |
| Screencast | ![Validation](docs/images/validation.png)           | Validation      |
| Screencast | ![Tooltip](docs/images/tooltip.png)                 | Tooltip         |

Replace placeholders with real media before publishing.

---

## Useful CLI Scripts

| Context                                   | Command                                                                               | Purpose                                                                      |
|-------------------------------------------|---------------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| **Database (local MySQL outside Docker)** | `DATABASE_URL="mysql://root:root@localhost:3306/next_user_manager" pnpm run db:reset` | Drop the schema and recreate an empty DB (no seed).                          |
|                                           | `DATABASE_URL="mysql://root:root@localhost:3306/next_user_manager" pnpm run db:dev`   | Full bootstrap: reset -> migrate dev -> seed -> generate Prisma client.      |
| **Backend (NestJS)**                      | `pnpm --filter backend run start:dev`                                                 | Hot-reload backend on [http://localhost:3001](http://localhost:3001).        |
| **Frontend (Next.js)**                    | `pnpm --filter frontend run dev`                                                      | Starts Next.js dev server on [http://localhost:3000](http://localhost:3000). |

Tip: the root-level `pnpm run dev` command spins up the whole stack via Docker Compose if you prefer containers.
