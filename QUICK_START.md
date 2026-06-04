# 🚀 Quick Start Deployment Commands

## Option 1: Automated Deploy (Recommended)

Run the PowerShell deployment script:

```powershell
.\deploy.ps1
```

This script will:
1. Check prerequisites (Node.js, pnpm, Git)
2. Initialize Git and push to GitHub
3. Deploy backend to Railway with PostgreSQL
4. Deploy frontend to Vercel
5. Set up environment variables automatically

---

## Option 2: Manual Step-by-Step

### 1. Push to GitHub

```bash
cd diaspora-platform
git init
git add .
git commit -m "Initial commit"

# Create repo at https://github.com/new
# Then:
git remote add origin https://github.com/YOUR_USERNAME/diaspora-platform.git
git branch -M main
git push -u origin main
```

### 2. Deploy Backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add postgres

# Set environment variables
railway env set JWT_SECRET="your-random-secret-64-chars"
railway env set SESSION_SECRET="another-random-secret-64-chars"
railway env set FRONTEND_URL="https://diaspora-platform.vercel.app"
railway env set NODE_ENV="production"

# Push database schema
railway run pnpm db:push

# Seed data
railway run pnpm db:seed

# Deploy
railway up

# Get your Railway URL
railway domain
```

### 3. Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Navigate to web app
cd apps/web

# Link project
vercel link --project diaspora-platform

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL
# Paste your Railway URL when prompted

vercel env add NEXT_PUBLIC_SENTRY_DSN
# Optional: Add Sentry DSN

vercel env add NEXT_PUBLIC_APP_URL
# Your Vercel URL

# Deploy
vercel --prod
```

### 4. Set Up Auto-Deploy (GitHub Actions)

Add these secrets to your GitHub repository:

1. Go to: GitHub Repo → Settings → Secrets and variables → Actions
2. Add these secrets:

| Secret | Where to Get |
|--------|--------------|
| `VERCEL_TOKEN` | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | Run `vercel projects list` |
| `VERCEL_PROJECT_ID` | Run `vercel projects list` |
| `RAILWAY_DEPLOY_HOOK` | Railway Dashboard → Settings → Deploy Hooks |

3. Push to main branch to trigger auto-deploy:
```bash
git commit -m "Test auto-deploy" --allow-empty
git push origin main
```

---

## ✅ Test Your Deployment

### 1. Test Health Check
```bash
curl https://your-railway-app.up.railway.app/health
```

### 2. Test Frontend
Open in browser: https://your-vercel-app.vercel.app

### 3. Test Login
- Email: `admin@diaspora.com`
- Password: `admin123`

### 4. Test API
```bash
curl -X POST https://your-railway-app.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@diaspora.com","password":"admin123"}'
```

---

## 🔧 Troubleshooting

### Build Fails
```bash
# Check Railway logs
railway logs

# Check Vercel build logs
vercel logs
```

### Database Errors
```bash
# Re-push schema
railway run pnpm db:push

# Re-seed data
railway run pnpm db:seed
```

### Frontend Can't Connect to API
1. Check `NEXT_PUBLIC_API_URL` in Vercel settings
2. Verify Railway URL is correct
3. Test API health endpoint

---

## 📞 Need Help?

- **Full Guide**: See `DEPLOYMENT_GUIDE.md`
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Issues**: Create an issue in your repo

---

**Test Credentials:**
- Admin: `admin@diaspora.com` / `admin123`
- Client: `client@example.com` / `client123`