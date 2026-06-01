# Diaspora Platform

Full-stack SSR platform for diaspora operations — relocation, verification, concierge, and family support services.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (App Router) + Tailwind CSS + shadcn/ui |
| Backend | Express.js + TypeScript |
| Database | PostgreSQL 16 + Prisma ORM (15 models) |
| Real-time | Socket.IO (chat, booking rooms) |
| Hosting | Vercel (frontend) + Railway (backend & DB) |
| Monitoring | Sentry + self-hosted status dashboard |
| Payments | M-Pesa Daraja API |
| Messaging | Twilio (SMS/WhatsApp) |
| File Storage | Local (dev) / AWS S3 (prod) |
| Email | Nodemailer (Mailpit in dev) |
| i18n | English + Swahili |
| Monorepo | pnpm workspaces + Turborepo |
| Infra as Code | Terraform + Pulumi |

## Quick Start

### Prerequisites

- Node.js >= 20, pnpm >= 9
- Docker Desktop (for local PostgreSQL, MinIO, Mailpit)
- PostgreSQL 16 (if not using Docker)

### Setup

```bash
# 1. Clone and install
git clone <repo-url> diaspora-platform
cd diaspora-platform
pnpm install

# 2. Start services (PostgreSQL, MinIO, Mailpit)
docker compose up -d

# 3. Copy environment file and fill in variables
cp .env.example .env

# 4. Generate Prisma client, push schema, seed data
pnpm db:generate
pnpm db:push
pnpm db:seed

# 5. Run dev servers
pnpm dev
```

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000
- **Mailpit UI**: http://localhost:8025
- **MinIO Console**: http://localhost:9001

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@diaspora.com | Admin123! |
| Staff | staff@diaspora.com | Admin123! |
| Client | client@example.com | Client123! |

## Project Structure

```
diaspora-platform/
├── apps/
│   ├── web/                    # Next.js frontend (App Router)
│   │   ├── app/                # Pages & layouts
│   │   │   ├── admin/          # Admin dashboard
│   │   │   ├── dashboard/      # User dashboard
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   └── verify-email/
│   │   ├── components/         # UI components
│   │   │   ├── ui/             # Button, Input, Card, Badge, etc.
│   │   │   ├── chat/           # ChatWidget (Socket.IO)
│   │   │   └── layout/         # Header, Footer, Sidebar
│   │   ├── lib/                # i18n, validations, hooks
│   │   └── locales/            # en.json, sw.json
│   └── api/                    # Express REST API
│       └── src/
│           ├── routes/         # auth, bookings, requests, etc.
│           ├── services/       # auth, email, mpesa, twilio, etc.
│           ├── middleware/     # auth, audit, security, error handler
│           └── validators/     # Zod schemas
├── packages/
│   ├── db/                     # Prisma schema & client
│   └── shared/                 # TypeScript types & validators
├── design-system/              # Design tokens & documentation
├── docs/                       # Deployment runbook
├── infra/                      # Terraform & Pulumi
├── monitoring/                 # Self-hosted status dashboard
├── scripts/                    # SSL renewal, DB backup
└── .github/                    # CI/CD workflows
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run all apps in dev mode |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Type-check all packages |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:seed` | Seed development data |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm test` | Run API tests (Vitest) |
| `make` | Makefile shortcuts |

## Features

### Auth & Security
- JWT-based authentication with HTTP-only cookies
- Role-based access (GUEST, CLIENT, STAFF, ADMIN, FOUNDER)
- Password reset via email token
- Email verification flow
- Rate limiting (global + auth endpoints)
- Helmet security headers
- Audit logging for all write operations

### Pages
- **Public**: Home, Services, About, Contact, Blog, FAQ
- **Auth**: Login, Register, Forgot/Reset Password, Verify Email
- **Dashboard**: Overview, Bookings, Requests, Payments, Documents, Notifications
- **Admin**: Overview (analytics), Users, Bookings, Requests, Verifications, Payments, Notifications, Analytics
- **Utility**: 404, Error boundary, Global error

### API Endpoints
- `POST /auth/register`, `/login`, `/forgot-password`, `/reset-password`, `/resend-verification`
- `GET /auth/me`, `/verify-email`
- `CRUD /bookings`, `/requests`, `/payments`, `/documents`, `/messages`
- `GET/PUT /notifications` + preference toggles
- `GET /admin/stats`, `/analytics`, `/users`, `/bookings`, `/requests`, `/verifications`, `/payments`, `/notifications`
- `POST /admin/notifications/broadcast`
- `GET /health` (DB status, uptime, version, env)

### Real-time Chat (Socket.IO)
- JWT-authenticated WebSocket connections
- Booking-scoped rooms
- REST fallback endpoint
- Runs on same HTTP server as Express

### Design System
- 3-layer tokens: primitive → semantic → component
- 7 color roles (primary, secondary, accent, neutral, success, warning, danger)
- Dark mode with CSS variables
- Responsive breakpoints (sm: 640, md: 768, lg: 1024, xl: 1280, 2xl: 1536)
- Accessible (WCAG AA minimum, skip-to-content, focus-visible ring)

### i18n
- English + Swahili runtime locale switching
- Persisted in localStorage
- LanguageSwitcher in header
- Reactive header/footer

### Monitoring
- Sentry error tracking (frontend + backend)
- Self-hosted status dashboard (`monitoring/dashboard.html`)
- Live health checks, latency tracking, log viewer

## Deployment

See [docs/deployment-runbook.md](docs/deployment-runbook.md).

### Quick Deploy

**Backend (Railway):**
```bash
# Deploy API service with PostgreSQL
# Link in Railway dashboard: API service → Variables → Add Reference → PostgreSQL
# Run in Railway Shell:
pnpm db:push
pnpm db:seed
```

**Frontend (Vercel):**
```bash
# Import repo, set root to apps/web
# Set NEXT_PUBLIC_API_URL to Railway URL
```

## Infrastructure

- `docker-compose.yml` — local dev (PostgreSQL + MinIO + Mailpit)
- `infra/main.tf` — Terraform (AWS RDS, S3, ECS, IAM)
- `infra/index.ts` — Pulumi equivalent
- `scripts/db-backup.sh` — pg_dump → S3 → Slack notification
- `scripts/ssl-renew.sh` — Let's Encrypt auto-renewal
