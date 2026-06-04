# 🚀 Post-Deployment Optimization Guide

After successfully deploying your Diaspora Platform, follow these steps to optimize performance, security, and user experience.

---

## 🎯 Immediate Post-Deployment Tasks

### 1. Verify All Systems Working

```bash
# Test health endpoint
curl https://your-railway-app.up.railway.app/health

# Expected response:
{
  "status": "healthy",
  "database": "healthy",
  "uptime": 123,
  "version": "0.1.0"
}
```

**Checklist:**
- [ ] Health check returns 200 OK
- [ ] Database status is "healthy"
- [ ] Frontend loads without errors
- [ ] Login works with test credentials
- [ ] Admin dashboard accessible

### 2. Update Production URLs

Update these in your Railway environment variables:

```bash
railway env set FRONTEND_URL="https://diaspora-platform.vercel.app"
railway env set MPESA_CALLBACK_URL="https://your-railway-app.up.railway.app/payments/mpesa-callback"
```

### 3. Change Default Passwords

**Critical:** Change test user passwords before going live!

```bash
# In Railway shell
railway run pnpm db:studio

# Or update via API:
curl -X PUT https://your-railway-app.up.railway.app/admin/users/USER_ID \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"password": "new-secure-password"}'
```

---

## ⚡ Performance Optimization

### Frontend (Vercel)

#### 1. Enable Edge Caching
```javascript
// next.config.js
module.exports = {
  ...
  headers: async () => [
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}
```

#### 2. Optimize Images
```jsx
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={630}
  priority
  quality={75}
/>
```

#### 3. Implement Lazy Loading
```jsx
// Lazy load heavy components
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('./Chart'), {
  loading: () => <Skeleton />,
  ssr: false,
})
```

#### 4. Monitor Performance
- Vercel Analytics → Web Vitals
- Check Lighthouse scores
- Target: LCP < 2.5s, FID < 100ms, CLS < 0.1

### Backend (Railway)

#### 1. Database Indexes
Add indexes to frequently queried fields:

```prisma
// schema.prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  @@index([email])
  @@index([role])
}

model Booking {
  id        String @id @default(cuid())
  userId    String
  status    BookingStatus
  @@index([userId])
  @@index([status])
  @@index([createdAt])
}
```

Then push:
```bash
railway run pnpm db:push
```

#### 2. Connection Pooling
Prisma already uses connection pooling by default. Monitor in Railway metrics.

#### 3. API Response Caching
```typescript
// Cache frequently accessed data
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 300 }) // 5 minutes

export async function getDashboardStats() {
  const cached = cache.get('stats')
  if (cached) return cached
  
  const stats = await prisma.$transaction([...])
  cache.set('stats', stats)
  return stats
}
```

#### 4. Rate Limiting Tuning
```typescript
// Adjust based on traffic
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increase for production
  message: { success: false, error: 'Too many requests' },
})
```

---

## 🔐 Security Hardening

### 1. Enable HTTPS Enforcement

**Vercel:** Automatic
**Railway:** Automatic on custom domains

### 2. Update CORS for Production

```typescript
// apps/api/src/app.ts
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
```

### 3. Add Security Headers

```typescript
// Already configured in middleware/security.ts
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
})
```

### 4. Rotate Secrets

```bash
# Generate new secrets
railway env set JWT_SECRET=$(openssl rand -hex 32)
railway env set SESSION_SECRET=$(openssl rand -hex 32)
```

### 5. Enable Database SSL

Railway PostgreSQL uses SSL by default. Verify in connection string:
```
DATABASE_URL=postgresql://...?sslmode=require
```

---

## 📧 Configure Production Services

### 1. Email (SendGrid)

```bash
# Get API key from https://sendgrid.com
railway env set EMAIL_HOST="smtp.sendgrid.net"
railway env set EMAIL_PORT="587"
railway env set EMAIL_USER="apikey"
railway env set EMAIL_PASS="YOUR_SENDGRID_KEY"
railway env set EMAIL_FROM="noreply@yourdomain.com"
```

**Test:**
```bash
# Trigger password reset
curl -X POST https://your-railway-app/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 2. M-Pesa Payments

```bash
# Get credentials from https://developer.safaricom.co.ke
railway env set MPESA_CONSUMER_KEY="your-key"
railway env set MPESA_CONSUMER_SECRET="your-secret"
railway env set MPESA_PASSKEY="your-passkey"
railway env set MPESA_SHORTCODE="174379"
railway env set MPESA_ENV="production"  # Switch from sandbox
railway env set MPESA_CALLBACK_URL="https://your-railway-app.up.railway.app/payments/mpesa-callback"
```

**Test STK Push:**
```bash
curl -X POST https://your-railway-app/payments/mpesa \
  -H "Authorization: Bearer TOKEN" \
  -d '{"phone": "+254700000000", "amount": 1000}'
```

### 3. Twilio (SMS/WhatsApp)

```bash
# Get credentials from https://twilio.com
railway env set TWILIO_ACCOUNT_SID="ACxxxx"
railway env set TWILIO_AUTH_TOKEN="your-token"
railway env set TWILIO_WHATSAPP_FROM="+14155238886"
railway env set TWILIO_SMS_FROM="+1234567890"
```

### 4. AWS S3 (File Storage)

```bash
# Create bucket in AWS Console
railway env set UPLOAD_DRIVER="s3"
railway env set AWS_ACCESS_KEY_ID="AKIAxxxx"
railway env set AWS_SECRET_ACCESS_KEY="your-key"
railway env set AWS_BUCKET="diaspora-uploads"
railway env set AWS_REGION="us-east-1"
```

**Test Upload:**
```bash
curl -X POST https://your-railway-app/documents \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@test.pdf"
```

---

## 📊 Monitoring Setup

### 1. Sentry Error Tracking

```bash
# Install Sentry CLI
npm install -g @sentry/cli

# Create project at https://sentry.io
railway env set SENTRY_DSN="https://key@o123.ingest.sentry.io/123"
railway env set SENTRY_ORG="your-org"
railway env set SENTRY_PROJECT="diaspora-api"

# Vercel
vercel env add NEXT_PUBLIC_SENTRY_DSN
```

**Create Release:**
```bash
sentry-cli releases new diaspora-api@1.0.0
sentry-cli releases set-commits diaspora-api@1.0.0 --auto
sentry-cli releases finalize diaspora-api@1.0.0
```

### 2. Uptime Monitoring

Set up at https://betteruptime.com or https://pingdom.com:

**Monitors:**
- `https://diaspora-platform.vercel.app` (every 1 min)
- `https://your-railway-app.up.railway.app/health` (every 30 sec)

**Alerts:**
- Email notifications
- SMS for critical issues
- Slack integration (optional)

### 3. Database Backups

Railway automatic backups:
- Retention: 30 days (default)
- Frequency: Daily
- Restore: Railway Dashboard → Database → Backups

**Manual Backup:**
```bash
railway run pg_dump $DATABASE_URL > backup.sql
```

---

## 🌐 Custom Domain Setup

### Vercel Frontend

1. **Add Domain in Vercel:**
   - Dashboard → Project → Settings → Domains
   - Add: `diasporalink.com`

2. **Update DNS:**
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Force HTTPS:** Automatic

### Railway Backend

1. **Add Domain:**
   ```bash
   railway domain add api.diasporalink.com
   ```

2. **Update DNS:**
   ```
   Type: CNAME
   Name: api
   Value: your-app.up.railway.app
   ```

3. **Update Frontend API URL:**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   # Enter: https://api.diasporalink.com
   ```

---

## 📈 Analytics & Insights

### 1. Vercel Analytics

Already enabled! View at:
- Dashboard → Project → Analytics
- Metrics: Page views, visitors, bounce rate

### 2. Core Web Vitals

Monitor in Vercel:
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

**Targets:**
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

### 3. Custom Analytics (Optional)

Add Google Analytics or plausible:

```jsx
// apps/web/app/layout.tsx
<script
  async
  src="https://analytics.umami.is/script.js"
  data-website-id="your-id"
/>
```

---

## 🔄 Maintenance Tasks

### Daily
- [ ] Check Sentry errors
- [ ] Review Railway logs
- [ ] Monitor uptime

### Weekly
- [ ] Review database size
- [ ] Check backup status
- [ ] Analyze user feedback
- [ ] Review performance metrics

### Monthly
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance optimization
- [ ] Feature planning

### Quarterly
- [ ] Disaster recovery test
- [ ] Load testing
- [ ] Security penetration test
- [ ] Cost optimization review

---

## 🚨 Incident Response

### Common Issues & Fixes

#### 1. High Error Rate
```bash
# Check Sentry for errors
# Check Railway logs
railway logs

# Common fixes:
railway env set DATABASE_URL="..."  # Reset connection
railway restart  # Restart service
```

#### 2. Slow Database
```bash
# Check slow queries in logs
# Add missing indexes
railway run pnpm db:push

# Consider upgrading Railway plan
```

#### 3. High Memory Usage
```bash
# Check Railway metrics
# Optimize Prisma queries
# Add pagination
# Consider caching
```

#### 4. Frontend Errors
```bash
# Check Vercel logs
vercel logs

# Rollback if needed
vercel rollback
```

---

## 📱 Mobile App Considerations

If you build a mobile app later:

1. **API Versioning:**
   ```
   /api/v1/bookings
   ```

2. **Mobile-Specific Endpoints:**
   ```typescript
   POST /auth/mobile-login
   ```

3. **Push Notifications:**
   ```bash
   railway env set FIREBASE_PROJECT_ID="..."
   railway env set EXPO_PUSH_KEY="..."
   ```

---

## 💰 Cost Optimization

### Current Costs (Free Tier)
- **Vercel:** $0 (Hobby plan)
- **Railway:** $5/month (Basic plan)
- **Total:** ~$5/month

### Scaling Costs
- **Vercel Pro:** $20/month (more bandwidth)
- **Railway Pro:** $20/month (more resources)
- **Sentry:** $26/month (team plan)
- **Total:** ~$71/month

### Optimization Tips
1. Use Vercel CDN for static assets
2. Enable Railway auto-scaling
3. Cache aggressively
4. Monitor database queries
5. Compress API responses

---

## 🎉 Success Metrics

Track these KPIs:

### Technical
- Uptime: > 99.9%
- API Response Time: < 500ms
- Page Load Time: < 3s
- Error Rate: < 0.1%

### Business
- User Registrations: Track weekly
- Booking Conversions: Monitor funnel
- User Retention: 30-day retention
- Revenue: Monthly recurring

---

## 📞 Support Contacts

- **Railway Support:** https://railway.app/help
- **Vercel Support:** https://vercel.com/support
- **Sentry Support:** https://sentry.io/support
- **Prisma Issues:** https://github.com/prisma/prisma/issues

---

**🚀 Your platform is now production-optimized!**

Regular monitoring and maintenance will ensure smooth operations.

For questions, refer to the comprehensive guides:
- `DEPLOYMENT_GUIDE.md`
- `DEPLOYMENT_CHECKLIST.md`
- `DEPLOYMENT_SUMMARY.md`