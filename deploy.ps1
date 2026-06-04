# Diaspora Platform - Quick Deploy Script
# This script automates the deployment setup

Write-Host "Diaspora Platform - Quick Deploy Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
  $nodeVersion = node --version
  Write-Host "[OK] Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
  Write-Host "[ERROR] Node.js not found. Install from https://nodejs.org" -ForegroundColor Red
  exit 1
}

# Check pnpm
try {
  $pnpmVersion = pnpm --version
  Write-Host "[OK] pnpm installed: $pnpmVersion" -ForegroundColor Green
} catch {
  Write-Host "[INFO] pnpm not found. Installing..." -ForegroundColor Yellow
  npm install -g pnpm@9.15.9
}

# Check Git
try {
  $gitVersion = git --version
  Write-Host "[OK] Git installed: $gitVersion" -ForegroundColor Green
} catch {
  Write-Host "[ERROR] Git not found. Install from https://git-scm.com" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "Step 1: Initialize Git Repository" -ForegroundColor Cyan
Write-Host ""

$gitInit = Read-Host "Initialize git repo and push to GitHub? (y/n)"

if ($gitInit -eq 'y' -or $gitInit -eq 'Y') {
  Write-Host "Initializing git..." -ForegroundColor Yellow
  git init
  git add .
  git commit -m "Initial commit: Diaspora platform"
  
  Write-Host ""
  Write-Host "Create a repository on GitHub:" -ForegroundColor Cyan
  Write-Host "1. Go to https://github.com/new" -ForegroundColor White
  Write-Host "2. Repository name: diaspora-platform" -ForegroundColor White
  Write-Host "3. DO NOT add README, .gitignore, or license" -ForegroundColor White
  Write-Host "4. Click Create repository" -ForegroundColor White
  Write-Host ""
  
  $githubUrl = Read-Host "Enter your GitHub repository URL"
  
  if ($githubUrl) {
    git remote add origin $githubUrl
    git branch -M main
    git push -u origin main
    Write-Host "[OK] Code pushed to GitHub!" -ForegroundColor Green
  }
}

Write-Host ""
Write-Host "Step 2: Deploy to Railway" -ForegroundColor Cyan
Write-Host ""

$railwayDeploy = Read-Host "Deploy backend to Railway? (y/n)"

if ($railwayDeploy -eq 'y' -or $railwayDeploy -eq 'Y') {
  Write-Host "Installing Railway CLI..." -ForegroundColor Yellow
  npm install -g @railway/cli
  
  Write-Host ""
  Write-Host "Logging into Railway..." -ForegroundColor Yellow
  railway login
  
  Write-Host ""
  Write-Host "Initializing Railway project..." -ForegroundColor Yellow
  railway init
  
  Write-Host ""
  Write-Host "Provisioning PostgreSQL database..." -ForegroundColor Yellow
  railway add postgres
  
  Write-Host ""
  Write-Host "Setting up environment variables..." -ForegroundColor Yellow
  
  # Generate random secrets
  $jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
  $sessionSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
  
  railway env set JWT_SECRET=$jwtSecret
  railway env set SESSION_SECRET=$sessionSecret
  railway env set FRONTEND_URL="https://diaspora-platform.vercel.app"
  railway env set NODE_ENV="production"
  railway env set PORT="4000"
  
  Write-Host ""
  Write-Host "Pushing database schema..." -ForegroundColor Yellow
  railway run pnpm db:push
  
  Write-Host ""
  Write-Host "Seeding initial data..." -ForegroundColor Yellow
  railway run pnpm db:seed
  
  Write-Host ""
  Write-Host "Deploying to Railway..." -ForegroundColor Yellow
  railway up
  
  Write-Host ""
  Write-Host "[OK] Backend deployed to Railway!" -ForegroundColor Green
  Write-Host "Get your Railway URL with: railway domain" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Step 3: Deploy to Vercel" -ForegroundColor Cyan
Write-Host ""

$vercelDeploy = Read-Host "Deploy frontend to Vercel? (y/n)"

if ($vercelDeploy -eq 'y' -or $vercelDeploy -eq 'Y') {
  Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
  npm install -g vercel
  
  Write-Host ""
  Write-Host "Logging into Vercel..." -ForegroundColor Yellow
  vercel login
  
  Write-Host ""
  Write-Host "Linking Vercel project..." -ForegroundColor Yellow
  Set-Location apps/web
  vercel link --project diaspora-platform
  
  Write-Host ""
  Write-Host "Setting up environment variables..." -ForegroundColor Yellow
  Write-Host "You'll need your Railway API URL for this step" -ForegroundColor Cyan
  Write-Host ""
  
  $railwayUrl = Read-Host "Enter your Railway API URL (e.g., https://your-app.up.railway.app)"
  
  if ($railwayUrl) {
    Write-Host "Note: You'll need to paste the Railway URL when prompted" -ForegroundColor Cyan
    vercel env add NEXT_PUBLIC_API_URL
    vercel env add NEXT_PUBLIC_SENTRY_DSN
    vercel env add NEXT_PUBLIC_APP_URL
  }
  
  Write-Host ""
  Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
  vercel --prod
  
  Set-Location ..\..
  Write-Host ""
  Write-Host "[OK] Frontend deployed to Vercel!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "====================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Test your deployment at the Vercel URL" -ForegroundColor White
Write-Host "2. Login with: admin@diaspora.com / admin123" -ForegroundColor White
Write-Host "3. Set up GitHub Actions for auto-deploy (see DEPLOYMENT_GUIDE.md)" -ForegroundColor White
Write-Host "4. Configure custom domains (optional)" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow
Write-Host ""
# Trigger CI deployment
