# 🚀 Diaspora Platform - Complete Deployment Guide

This guide will walk you through deploying the entire platform to **GitHub**, **Railway** (backend + database), and **Vercel** (frontend).

---

## ✅ Prerequisites

Create accounts on:
1. [GitHub](https://github.com)
2. [Railway](https://railway.app)
3. [Vercel](https://vercel.com)

Install these tools locally:
```bash
# Install Node.js (v20+)
https://nodejs.org

# Install pnpm
npm install -g pnpm@9.15.9

# Install Railway CLI
npm install -g @railway/cli

# Install Vercel CLI
npm install -g vercel

# Install Git
https://git-scm.com
```

---

## 📦 Step 1: Push Code to GitHub

### 1.1 Initialize Git Repository

```bash
cd diaspora-platform
git init
git add .
git commit -m "Initial commit: Diaspora platform"
```

### 1.2 Create GitHub Repository

**Option A: Using GitHub CLI (Recommended)**
```bash
# Login to GitHub
gh auth login

# Create repository
gh repo create diaspora-platform --public --source=. --remote=origin --push
```

**Option B: Manual GitHub Setup**
1. Go to https://github.com/new
2. Repository name: `diaspora-platform`
3. **DO NOT** add README, .gitignore, or license
4. Click "Create repository"
5. Copy the repository URL

```bash
# Connect local repo to GitHub
git remote add origin https://github.com/YOUR_USERNAME/diaspora-platform.git
git branch -M main
git push -u origin main
```

---

## 🛤️ Step 2: Deploy Backend to Railway

### 2.1 Login to Railway

```bash
railway login
```

### 2.2 Create New Project

```bash
# Initialize Railway project
railway init

# This will create a new project in your Railway dashboard
```

### 2.3 Provision PostgreSQL Database

**Via CLI:**
```bash
railway add postgres
```

**Via Dashboard (Alternative):**
1. Go to https://railway.app/dashboard
2. Select your project
3. Click "New" → "Database" → "PostgreSQL"
4. Wait for provisioning

### 2.4 Configure Environment Variables

```bash
# Set required environment variables
railway env set JWT_SECRET="$(openssl rand -hex 32)"
railway env set SESSION_SECRET="$(openssl rand -hex 32)"
railway env set FRONTEND_URL="https://diaspora-platform.vercel.app"
railway env set NODE_ENV="production"
railway env set PORT="4000"

# Email (optional - for production email)
railway env set EMAIL_HOST="smtp.sendgrid.net"
railway env set EMAIL_PORT="587"
railway env set EMAIL_USER="apikey"
railway env set EMAIL_PASS="YOUR_SENDGRID_API_KEY"
railway env set EMAIL_FROM="noreply@yourdomain.com"

# M-Pesa (optional - for payments)
railway env set MPESA_CONSUMER_KEY="your_consumer_key"
railway env set MPESA_CONSUMER_SECRET="your_consumer_secret"
railway env set MPESA_PASSKEY="your_passkey"
railway env set MPESA_SHORTCODE="174379"
railway env set MPESA_ENV="sandbox"
railway env set MPESA_CALLBACK_URL="https://your-railway-url.up.railway.app/payments/mpesa-callback"

# Twilio (optional - for SMS/WhatsApp)
railway env set TWILIO_ACCOUNT_SID="your_account_sid"
railway env set TWILIO_AUTH_TOKEN="your_auth_token"
railway env set TWILIO_WHATSAPP_FROM="+14155238886"
railway env set TWILIO_SMS_FROM="+1234567890"

# Sentry (optional - for error tracking)
railway env set SENTRY_DSN="https://key@o123.ingest.sentry.io/123"
railway env set SENTRY_ORG="your-org"
railway env set SENTRY_PROJECT="diaspora-api"

# File Storage (optional - for S3)
railway env set UPLOAD_DRIVER="s3"
railway env set AWS_ACCESS_KEY_ID="your_access_key"
railway env set AWS_SECRET_ACCESS_KEY="your_secret_key"
railway env set AWS_BUCKET="diaspora-uploads"
railway env set AWS_REGION="us-east-1"
```

**For local testing without production services:**
```bash
# Use simulated services (no real API keys needed)
railway env set MPESA_CONSUMER_KEY=""
railway env set MPESA_CONSUMER_SECRET=""
railway env set EMAIL_HOST="localhost"
railway env set EMAIL_PORT="1025"
```

### 2.5 Deploy Database Schema

```bash
# Push Prisma schema to Railway PostgreSQL
railway run pnpm db:push

# Seed initial data (admin + test users)
railway run pnpm db:seed
```

### 2.6 Deploy API Service

```bash
# Deploy to Railway
railway up
```

### 2.7 Add Custom Domain (Optional)

```bash
# Add custom domain
railway domain add api.yourdomain.com
```

**Update DNS:**
```
CNAME api → your-app.up.railway.app
```

### 2.8 Get Your Railway URL

```bash
railway domain
# Returns: https://diaspora-api.up.railway.app
```

**Save this URL** - you'll need it for Vercel configuration.

---

## ▲ Step 3: Deploy Frontend to Vercel

### 3.1 Login to Vercel

```bash
vercel login
```

### 3.2 Link Project

```bash
cd apps/web
vercel link --project diaspora-platform
```

### 3.3 Set Environment Variables

```bash
# Set API URL (replace with your Railway URL)
vercel env add NEXT_PUBLIC_API_URL
# Paste: https://your-railway-app.up.railway.app

# Set Sentry DSN (optional)
vercel env add NEXT_PUBLIC_SENTRY_DSN
# Paste: https://key@o123.ingest.sentry.io/123

# Set app URL
vercel env add NEXT_PUBLIC_APP_URL
# Paste: https://diaspora-platform.vercel.app (or your custom domain)
```

### 3.4 Deploy to Production

```bash
vercel --prod
```

### 3.5 Add Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain: `diasporalink.com` or `yourdomain.com`
3. Update DNS as instructed by Vercel

**DNS Configuration:**
```
CNAME @ → cname.vercel-dns.com
CNAME www → cname.vercel-dns.com
```

---

## 🔧 Step 4: Configure GitHub for Auto-Deploy

### 4.1 Add GitHub Secrets

Go to your GitHub repo → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `VERCEL_TOKEN` | Get from https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | Run `vercel projects list` to get |
| `VERCEL_PROJECT_ID` | Run `vercel projects list` to get |
| `RAILWAY_DEPLOY_HOOK` | Railway Dashboard → Settings → Deploy Hooks → Create |
| `SENTRY_AUTH_TOKEN` | Sentry → Settings → API Tokens |
| `SENTRY_ORG` | Your Sentry org slug |
| `SENTRY_PROJECT` | Your Sentry project slug |

### 4.2 Enable GitHub Actions

The `.github/workflows/ci.yml` is already configured to:
1. Run quality checks on every push
2. Run tests on pull requests
3. Auto-deploy to Vercel on main branch
4. Auto-deploy to Railway on main branch
5. Create Sentry release

### 4.3 Test Auto-Deploy

```bash
# Make a small change
echo "# Test" >> README.md
git add .
git commit -m "Test auto-deploy"
git push origin main
```

Check GitHub Actions tab to see the deployment pipeline.

---

## 🧪 Step 5: Verify Deployment

### 5.1 Test Health Check

```bash
curl https://your-railway-app.up.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "uptime": 123,
  "database": "healthy",
  "version": "0.1.0",
  "node": "v20.x.x",
  "environment": "production",
  "timestamp": "2026-06-03T..."
}
```

### 5.2 Test Frontend

1. Open https://your-vercel-app.vercel.app
2. Test homepage loads
3. Try login with test credentials:
   - Email: `admin@diaspora.com`
   - Password: `admin123`

### 5.3 Test API Endpoints

```bash
# Test login
curl -X POST https://your-railway-app.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@diaspora.com","password":"admin123"}'
```

### 5.4 Test Real-time Chat

1. Login to the platform
2. Create a booking
3. Open the chat widget
4. Send a message
5. Verify it appears in real-time

---

## 📊 Step 6: Set Up Monitoring

### 6.1 Sentry Error Tracking

**Frontend:**
1. Already configured in `apps/web/sentry.config.ts`
2. Errors automatically reported to Sentry

**Backend:**
1. Already configured in `apps/api/src/middleware/sentry.ts`
2. Errors automatically reported

### 6.2 Railway Metrics

1. Go to Railway Dashboard → Your Project
2. Click "Metrics" tab
3. View CPU, Memory, Network usage

### 6.3 Vercel Analytics

1. Go to Vercel Dashboard → Your Project
2. Click "Analytics" tab
3. View page views, TTFB, Core Web Vitals

### 6.4 Uptime Monitoring (Optional)

Set up monitoring at:
- https://betteruptime.com (free tier available)
- https://pingdom.com

Monitor these endpoints:
- `https://yourdomain.com`
- `https://your-railway-app.up.railway.app/health`

---

## 🔐 Security Checklist

- [ ] All environment variables set in Railway
- [ ] All environment variables set in Vercel
- [ ] JWT secrets are random and secure
- [ ] Database password is strong
- [ ] HTTPS enabled (automatic on Vercel/Railway)
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Security headers enabled (Helmet)
- [ ] Audit logging active

---

## 🚨 Troubleshooting

### Build Fails on Railway

```bash
# Check build logs
railway logs

# Common issues:
# 1. Missing environment variables → railway env set
# 2. Database not connected → railway add postgres
# 3. Schema not pushed → railway run pnpm db:push
```

### Frontend Can't Connect to API

1. Check `NEXT_PUBLIC_API_URL` in Vercel
2. Verify Railway URL is correct
3. Check CORS settings in `apps/api/src/app.ts`

### Database Errors

```bash
# Re-push schema
railway run pnpm db:push

# Reset database (destructive!)
railway run pnpm db:migrate reset

# View logs
railway logs
```

### WebSocket Connection Fails

1. Check `FRONTEND_URL` env var matches Vercel domain
2. Verify Socket.IO server is running
3. Check browser console for errors

---

## 📈 Next Steps

### Performance Optimization
- Enable Vercel Caching
- Add database indexes
- Implement Redis caching

### Backup Strategy
- Set up automated PostgreSQL backups
- Configure S3 versioning
- Test disaster recovery

### Scaling
- Railway auto-scales with traffic
- Vercel handles CDN automatically
- Consider Railway Pro for more resources

---

## 🎯 Quick Reference Commands

```bash
# Local Development
pnpm dev                    # Run all apps
pnpm db:push               # Push schema to local DB
pnpm db:seed               # Seed test data

# Railway
railway login              # Login
railway init               # Create project
railway add postgres       # Add database
railway env set KEY=VALUE  # Set env var
railway run pnpm db:push   # Push schema
railway up                 # Deploy
railway logs               # View logs

# Vercel
vercel login               # Login
vercel link                # Link project
vercel env add KEY         # Add env var
vercel --prod             # Deploy to production

# GitHub
git push origin main       # Push code
gh pr create              # Create pull request
```

---

## 📞 Support

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://prisma.io/docs

---

**🎉 Congratulations!** Your Diaspora Platform is now live on Vercel + Railway with GitHub auto-deploy!