# Deployment Guide

## Overview

- **Frontend**: Vercel (optimized for Next.js SSR)
- **Backend**: Railway (Express + PostgreSQL)
- **Source**: GitHub

## Environment Variables

### Frontend (Vercel)

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.yourdomain.com` |

### Backend (Railway)

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Railway PostgreSQL connection string |
| `PORT` | `4000` |
| `FRONTEND_URL` | `https://yourdomain.com` |
| `JWT_SECRET` | Random secure string |
| `NODE_ENV` | `production` |

## Deployment Steps

### Frontend (Vercel)

1. Connect GitHub repo to Vercel.
2. Set root directory to `apps/web`.
3. Configure build command: `pnpm build`.
4. Add environment variables.
5. Deploy.

### Backend (Railway)

1. Connect GitHub repo to Railway.
2. Set root directory to `apps/api`.
3. Add a PostgreSQL database plugin.
4. Set build command: `pnpm install && pnpm db:generate`.
5. Set start command: `pnpm start`.
6. Add environment variables.
7. Deploy.

## CI/CD Pipeline

The `.github/workflows/ci.yml` runs on every push:

1. Lint & type-check
2. Build test
3. Deploy frontend to Vercel
4. Deploy backend to Railway
5. Run database migrations

## Post-Deployment Checklist

- [ ] SSL/TLS is active
- [ ] Environment variables are set
- [ ] Database migrations have run
- [ ] Seed data is loaded (if needed)
- [ ] Auth flow works end-to-end
- [ ] API health endpoint responds
- [ ] CORS is configured correctly
- [ ] Cookie settings use `secure: true`
