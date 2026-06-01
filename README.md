# Diaspora Platform

A full-stack SSR website and backend platform for diaspora operations, relocation, verification, and concierge services.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS + shadcn/ui |
| Backend | Express.js + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Hosting | Vercel (frontend) + Railway (backend & DB) |
| Monorepo | pnpm workspaces + Turborepo |

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- PostgreSQL

### 1. Clone and install

```bash
git clone <repo-url> diaspora-platform
cd diaspora-platform
pnpm install
```

### 2. Set up environment

```bash
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local
```

Edit the files with your database URL and secrets.

### 3. Initialize database

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

### 4. Run development

```bash
pnpm dev
```

- Frontend: http://localhost:3000
- API: http://localhost:4000

## Project Structure

```
diaspora-platform/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express backend
├── packages/
│   ├── db/           # Prisma client & schema
│   └── shared/       # Shared types & validators
├── docs/             # Documentation
└── .github/          # CI/CD workflows
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run all apps in dev mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Type-check all packages |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:seed` | Seed dev data |
| `pnpm db:studio` | Open Prisma Studio |

## Test Credentials (Dev)

- **Admin**: admin@diaspora.com / admin123
- **Client**: client@example.com / client123

## Deployment

See [deployment.md](docs/deployment.md).

## API Reference

See [api-spec.md](docs/api-spec.md).

## UI Guidelines

See [ui-guidelines.md](docs/ui-guidelines.md).
