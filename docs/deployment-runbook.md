# DiasporaLink - Deployment Runbook

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | >= 20 | https://nodejs.org |
| pnpm | 9.15.9 | `npm i -g pnpm@9.15.9` |
| Docker | Latest | https://docker.com |
| Git | Latest | https://git-scm.com |
| Railway CLI | Latest | `npm i -g @railway/cli` |
| Vercel CLI | Latest | `npm i -g vercel` |

---

## 1. Local Development Setup

### Start PostgreSQL (Docker)
```bash
docker compose up -d postgres
# Verify: docker compose ps
```

### Install & Seed Database
```bash
pnpm install
pnpm db:push     # Push schema to PostgreSQL
pnpm db:seed     # Create test users
```

Test credentials after seeding:
- **Admin**: admin@diaspora.com / Admin123!
- **Client**: client@example.com / Client123!

### Start Dev Servers
```bash
# Terminal 1 - API (port 4000)
pnpm --filter @diaspora/api dev

# Terminal 2 - Frontend (port 3000)
pnpm --filter @diaspora/web dev
```

### Optional: Local Email Testing (Mailpit)
```bash
docker compose up -d mailpit
# Web UI: http://localhost:8025
```

### Optional: Local File Storage (MinIO)
```bash
docker compose up -d minio
# Console: http://localhost:9001 (diaspora / diaspora_dev)
```

---

## 2. Railway Deployment (Backend + Database)

### Step 1: Create Railway Project
```bash
railway login
railway init
```

### Step 2: Provision PostgreSQL
```bash
railway add postgres
# Railway auto-sets DATABASE_URL env variable
```

### Step 3: Configure Environment Variables
```bash
railway env set JWT_SECRET="<random-64-char-string>"
railway env set SESSION_SECRET="<another-random-string>"
railway env set FRONTEND_URL="https://diasporalink.vercel.app"
railway env set NODE_ENV=production
railway env set UPLOAD_DRIVER=s3
# ... email, M-Pesa, Sentry variables (see .env.example)
```

### Step 4: Push Database Schema
```bash
railway run pnpm db:push
railway run pnpm db:seed
```

### Step 5: Deploy
```bash
railway up
# Or connect GitHub repo in Railway dashboard for auto-deploy
```

**Railway Configuration** (`railway.json` and `nixpacks.toml` are pre-configured in the repo).

### Step 6: Get Deployment URL
```bash
railway domain
# Returns: https://diaspora-api.up.railway.app
```

---

## 3. Vercel Deployment (Frontend)

### Step 1: Install & Login
```bash
vercel login
```

### Step 2: Link Project
```bash
cd apps/web
vercel link --project diaspora-web
```

### Step 3: Set Environment Variables
```bash
vercel env add NEXT_PUBLIC_API_URL
# Paste: https://diaspora-api.up.railway.app
vercel env add NEXT_PUBLIC_SENTRY_DSN
# Paste: https://key@o123.ingest.sentry.io/123
vercel env add NEXT_PUBLIC_APP_URL
# Paste: https://diasporalink.vercel.app
```

### Step 4: Deploy
```bash
vercel --prod
```

### Auto-deploy from GitHub
In Vercel dashboard:
1. Import your GitHub repo
2. Set Framework: Next.js
3. Root directory: `apps/web`
4. Build command: `cd ../.. && pnpm build --filter=@diaspora/web`
5. Install command: `pnpm install --frozen-lockfile`
6. Add environment variables above

---

## 4. Sentry Error Monitoring

### Frontend (Next.js)
1. Create project at https://sentry.io → select Next.js
2. Add DSN to Vercel:
   ```bash
   vercel env add NEXT_PUBLIC_SENTRY_DSN
   ```
3. Add to Railway:
   ```bash
   railway env set SENTRY_DSN="https://key@o123.ingest.sentry.io/123"
   railway env set SENTRY_ORG="your-org"
   railway env set SENTRY_PROJECT="diaspora-api"
   ```

### Backend (Express)
Sentry is pre-configured in `apps/api/src/middleware/sentry.ts`. The DSN is picked up from `SENTRY_DSN` env variable.

### Create Releases (optional)
```bash
# Install Sentry CLI
npm i -g @sentry/cli

# Create release
sentry-cli releases new diaspora-api@1.0.0
sentry-cli releases set-commits diaspora-api@1.0.0 --auto
sentry-cli releases finalize diaspora-api@1.0.0
```

---

## 5. Twilio (SMS / WhatsApp)

### Step 1: Create Twilio Account
1. Sign up at https://twilio.com
2. Verify your phone number
3. Get Account SID and Auth Token from console

### Step 2: Get WhatsApp Sandbox (for testing)
1. Go to Messaging → Try it out → Send a WhatsApp message
2. Activate sandbox and save the number (e.g., `+14155238886`)
3. Join the sandbox by sending the join code from your WhatsApp

### Step 3: Set Environment Variables
```bash
railway env set TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxx"
railway env set TWILIO_AUTH_TOKEN="xxxxxxxxxxxx"
railway env set TWILIO_WHATSAPP_FROM="+14155238886"
railway env set TWILIO_SMS_FROM="+1234567890"
```

### Step 4: Production WhatsApp
1. Request WhatsApp Business API access in Twilio console
2. Purchase a phone number that supports WhatsApp
3. Update `TWILIO_WHATSAPP_FROM` to the new number

---

## 6. M-Pesa Daraja API

### Step 1: Create Safaricom Developer Account
1. Register at https://developer.safaricom.co.ke
2. Create an app → get Consumer Key & Secret
3. Set `MPESA_ENV=sandbox` for testing

### Step 2: Configure Callback URL
1. Deploy the API to Railway (get public URL)
2. Set: `MPESA_CALLBACK_URL=https://diaspora-api.up.railway.app/payments/mpesa-callback`
3. For local testing: use ngrok `ngrok http 4000`

### Step 3: Production Checklist
- [ ] Register as a Safaricom partner
- [ ] Get production Shortcode (usually 5-6 digits)
- [ ] Set `MPESA_ENV=production`
- [ ] Update `MPESA_SHORTCODE` to your production code
- [ ] Whitelist callback IPs with Safaricom
- [ ] Set `MPESA_PASSKEY` from production portal

---

## 7. AWS S3 for File Storage

### Step 1: Create S3 Bucket
```bash
aws s3 mb s3://diaspora-uploads --region us-east-1
```

### Step 2: Configure Bucket Policy (public read)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::diaspora-uploads/*"
    }
  ]
}
```

### Step 3: Set IAM Credentials
```bash
railway env set UPLOAD_DRIVER=s3
railway env set AWS_ACCESS_KEY_ID="AKIAxxxx"
railway env set AWS_SECRET_ACCESS_KEY="xxxx"
railway env set AWS_BUCKET="diaspora-uploads"
railway env set AWS_REGION="us-east-1"
```

---

## 8. GitHub Setup & Push

### Initialize & Push
```bash
# From project root
git init
git add .
git commit -m "Initial commit: DiasporaLink full-stack platform"

# Create repo on GitHub.com (do NOT add README/LICENSE/.gitignore)
gh repo create diaspora-platform --public --source=. --remote=origin --push
```

### Without GitHub CLI
```bash
git remote add origin https://github.com/YOUR_USER/diaspora-platform.git
git branch -M main
git push -u origin main
```

### Required GitHub Secrets (for CI/CD)
| Secret | Value |
|--------|-------|
| `VERCEL_TOKEN` | Vercel account token (https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel org ID from `vercel projects list` |
| `VERCEL_PROJECT_ID` | Vercel project ID from `vercel projects list` |
| `RAILWAY_DEPLOY_HOOK` | Railway deploy hook URL (Dashboard → Settings → Deploy Hooks) |
| `SENTRY_AUTH_TOKEN` | Sentry auth token (https://sentry.io/settings/account/api/auth-tokens/) |
| `SENTRY_ORG` | Sentry organization slug |
| `SENTRY_PROJECT` | Sentry project slug |

---

## 9. CI/CD Pipeline

The pre-configured `.github/workflows/ci.yml` runs on every push:
1. **quality** — lint + build
2. **test** — spins up PostgreSQL, pushes schema
3. **deploy-frontend** — deploys to Vercel (main branch only)
4. **deploy-backend** — triggers Railway deploy hook (main branch only)
5. **release** — creates Sentry release

---

## 10. HTTPS & Custom Domain

### Vercel (Frontend)
```bash
vercel domains add diasporalink.com
# Update DNS: CNAME @ -> cname.vercel-dns.com
```

### Railway (Backend)
1. Settings → Custom Domain → Add domain
2. Update DNS: CNAME api → your-railway-app.up.railway.app

### Force HTTPS
- Vercel: auto-enforces HTTPS
- Railway: auto-enforces HTTPS on custom domains

---

## 11. Monitoring & Alerts

- **Sentry**: Error tracking (real-time alerts via email/Slack)
- **Railway Metrics**: CPU, Memory, Network in dashboard
- **Vercel Analytics**: Page views, TTFB, Core Web Vitals
- **Uptime Monitoring**: Set up monitoring at https://betteruptime.com or https://pingdom.com
  - Monitor: `https://diasporalink.com`
  - Monitor: `https://diaspora-api.up.railway.app/health`
- **Self-Hosted Status Dashboard**: Open `monitoring/dashboard.html` in any browser for a live status check showing API/DB/frontend health, latency, and a 20-entry check log. Auto-refreshes every 60 seconds.

---

## 12. Real-Time Messaging (Socket.IO)

### Architecture
- Socket.IO server runs on the same HTTP server as the Express API (port 4000)
- Clients authenticate via JWT token passed in `auth.token` or `query.token`
- Messages are organized in booking-scoped rooms (`booking:<bookingId>`)
- Messages persist to the `Message` table via Prisma

### Client Connection
```typescript
import { io } from "socket.io-client"
const socket = io(API_URL, {
  auth: { token: "jwt-token-here" },
  transports: ["websocket", "polling"],
})
socket.emit("join:booking", bookingId)
socket.on("message:new", (msg) => console.log(msg))
socket.emit("message:send", { bookingId, content: "Hello!" })
```

### Events
| Event | Direction | Payload |
|-------|-----------|---------|
| `join:booking` | client → server | `bookingId: string` |
| `leave:booking` | client → server | `bookingId: string` |
| `message:send` | client → server | `{ bookingId, content }` |
| `message:new` | server → client | `Message` object |
| `error` | server → client | `{ message: string }` |

### Railway Deployment
No additional setup needed — Socket.IO is multiplexed on the same port as Express.
Ensure `FRONTEND_URL` env var matches the Vercel domain for CORS.

---

## 13. Auth Flows (Password Reset & Email Verification)

### Forgot Password
1. User submits email at `/forgot-password`
2. `POST /auth/forgot-password` creates a reset token (crypto.randomBytes(32), 1-hour expiry)
3. `sendPasswordReset()` email sends a link: `/reset-password?token=<token>`
4. User submits new password at `/reset-password`
5. `POST /auth/reset-password` hashes & updates password, clears token

### Email Verification
1. On registration, a `verificationToken` is generated (24-hour expiry)
2. `sendVerificationEmail()` sends a link: `/verify-email?token=<token>`
3. `GET /auth/verify-email?token=<token>` marks `emailVerified = true`
4. Unverified users can still log in; `emailVerified` field is returned in login response

### Resend Verification
`POST /auth/resend-verification` with `{ email }` regenerates the token and re-sends the email.

---

## 14. Admin Notification Broadcast

### Page
Located at `/admin/notifications`. Allows admins to:
1. **Broadcast email** — compose subject + HTML body and send to all users
2. **View recent notifications** — audit log of system-generated notifications

### API
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/notifications` | List recent notification audit logs |
| `POST` | `/admin/notifications/broadcast` | Send email to all (or specified) users |

### Automatic Notifications
The system automatically triggers notifications on these events:
- **Booking created** → confirmation email to client
- **Payment received** → receipt email to client
- **Verification completed** → result email to client

Each notification respects the user's `NotificationPreference` settings (email/SMS/WhatsApp toggles).

---

## 15. Audit Logging

All write operations to key entities are automatically logged to the `AuditLog` table:
- `POST /bookings` → `booking_created`
- `POST /payments` → `payment_created`
- `POST /verifications` → `verification_created`
- `POST /documents` → `document_uploaded`

Each entry records: userId, action, entity, entityId, request details (method, path, statusCode), and IP address.
View audit logs at `/admin/audit-logs` (API: `GET /admin/audit-logs`).

---

## 16. i18n (Internationalization)

### Supported Locales
- **English** (`en`) — default
- **Swahili** (`sw`)

### How It Works
1. Translation files in `apps/web/locales/` — `en.json` and `sw.json`
2. Locale is persisted in `localStorage` (key: `locale`)
3. `lib/i18n.ts` — lightweight runtime class with `t()` function for key lookup
4. `components/LanguageSwitcher.tsx` — UI toggle in the header (displays "EN" or "SW")
5. Header and footer automatically re-render on locale change via a subscription pattern

### Adding a New Language
1. Create `apps/web/locales/fr.json` with the same key structure
2. Add `fr` to `type Locale` in `lib/i18n.ts`
3. Add `fr` to `locales` object
4. The LanguageSwitcher will need a dropdown if >2 locales

---

## 17. API Tests

### Run Tests
```bash
# All API tests
pnpm --filter @diaspora/api test

# Watch mode
pnpm --filter @diaspora/api test:watch
```

### Test Coverage
Tests cover these services with mocked Prisma:
- **Auth** — register (duplicate email, success), login (wrong email, wrong password), forgotPassword, verifyEmail
- **Email** — verifies email dispatch functions are callable
- **Messaging** — sendMessage, getMessages
- **Notifications** — getPreferences (auto-create defaults), updatePreferences, shouldNotify

### E2E Tests (Playwright)
```bash
# Requires Playwright browsers installed first
npx playwright install chromium

pnpm --filter @diaspora/web test:e2e
```

---

## 18. Quick Reference: Deploy from Scratch

```bash
# 1. Clone
git clone https://github.com/YOUR_USER/diaspora-platform.git
cd diaspora-platform

# 2. Install
pnpm install

# 3. Database
docker compose up -d postgres
pnpm db:push
pnpm db:seed

# 4. Run
pnpm dev    # Starts both API + Web via Turborepo

# Or individually:
pnpm --filter @diaspora/api dev    # Terminal 1
pnpm --filter @diaspora/web dev    # Terminal 2
```

## 19. Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✓ | — | PostgreSQL connection string |
| `JWT_SECRET` | ✓ | dev-secret-change-in-production | JWT signing key |
| `FRONTEND_URL` | — | http://localhost:3000 | CORS origin |
| `NODE_ENV` | — | development | Environment mode |
| `PORT` | — | 4000 | API server port |
| `EMAIL_HOST` | — | localhost | SMTP host |
| `EMAIL_PORT` | — | 1025 | SMTP port |
| `EMAIL_USER` | — | — | SMTP username |
| `EMAIL_PASS` | — | — | SMTP password |
| `EMAIL_FROM` | — | noreply@diasporalink.com | From address |
| `SENTRY_DSN` | — | — | Sentry DSN |
| `MPESA_CONSUMER_KEY` | — | — | Daraja consumer key |
| `MPESA_CONSUMER_SECRET` | — | — | Daraja consumer secret |
| `MPESA_PASSKEY` | — | — | Daraja passkey |
| `MPESA_SHORTCODE` | — | 174379 | Daraja shortcode |
| `MPESA_ENV` | — | sandbox | sandbox or production |
| `MPESA_CALLBACK_URL` | — | — | STK Push callback |
| `TWILIO_ACCOUNT_SID` | — | — | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | — | — | Twilio auth token |
| `TWILIO_WHATSAPP_FROM` | — | — | WhatsApp sender number |
| `TWILIO_SMS_FROM` | — | — | SMS sender number |
| `UPLOAD_DRIVER` | — | local | local or s3 |
| `AWS_ACCESS_KEY_ID` | — | — | S3 access key |
| `AWS_SECRET_ACCESS_KEY` | — | — | S3 secret key |
| `AWS_BUCKET` | — | — | S3 bucket name |
None of the above yet — this is a freshly scoped build. Here's the full record of what was built in this session:

## ✓ Completed (15 items from previous session)

| Area | What was done |
|------|---------------|
| **Health check** | Upgraded `/health` — returns DB status, uptime, Node version, environment |
| **Seed script** | `packages/db/prisma/seed.ts` — admin/staff/client accounts, bookings, requests, payments, invoices, blog posts, testimonials |
| **Makefile** | `Makefile` at root with dev/build/lint/test/db shortcuts |
| **i18n** | `locales/en.json` + `locales/sw.json`, `lib/i18n.ts` runtime, `LanguageSwitcher` component in header |
| **Notification prefs** | API route `GET/PUT /notifications/preferences`, dashboard page with toggle switches |
| **Real-time chat** | Socket.IO server (`socket.ts`), Prisma `Message` model, `ChatWidget` component, REST fallback |
| **Admin analytics** | Chart.js line/bar charts for 6-month trends (bookings, revenue, users, requests) |
| **Responsive** | CSS utilities (`container-main`, `truncate-*`, `card-hover-effect`), smaller mobile font, custom scrollbars |
| **Dark mode** | Scrollbar styling, `motion:reduce` respect |
| **E2E tests** | Playwright config + spec: auth, public pages, mobile menu, skip-to-content, dark mode toggle |
| **SSL script** | `scripts/ssl-renew.sh` — Certbot renewal with nginx reload |
| **DB backup** | `scripts/db-backup.sh` — pg_dump, gzip, S3, Slack notification, rotation |
| **Monitoring** | `monitoring/dashboard.html` — standalone status page with live health checks |
| **Infra-as-code** | `infra/main.tf` (Terraform), `infra/index.ts` (Pulumi), example vars |

## ✓ Completed (this session — 7 items)

| Item | What was built |
|------|---------------|
| **Password reset** | `POST /auth/forgot-password`, `POST /auth/reset-password`, email with token, `/forgot-password` and `/reset-password` pages |
| **Email verification** | Verification token on register, `GET /auth/verify-email`, `/verify-email` page, `POST /auth/resend-verification` |
| **Audit logging** | `middleware/auditLog.ts` — auto-logs all writes to AuditLog table (booking/payment/verification/document) |
| **Notification triggers** | `services/notificationTriggers.ts` — wired into booking/payment/verification controllers, respects user prefs |
| **Admin notifications** | `GET /admin/notifications`, `POST /admin/notifications/broadcast`, `/admin/notifications` page with broadcast form + audit log view |
| **API tests** | Vitest suite: 12 tests covering auth, email, messaging, notification services |
| **Runbook update** | `docs/deployment-runbook.md` — new sections for Socket.IO, auth flows, admin notifications, audit logging, i18n, API tests, env var reference |

## Still Blocked

- **GitHub push** — git not installed on this system. Once available:
  ```bash
  git init && git add . && git commit -m "Initial commit"
  gh repo create diaspora-platform --public --source=. --remote=origin --push
  ```
