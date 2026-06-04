# 🏗️ Diaspora Platform - Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                    │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│    │  Client  │  │  Staff   │  │  Admin   │  │ Founder  │     │
│    └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
└─────────┼─────────────┼─────────────┼─────────────┼────────────┘
          │             │             │             │
          └─────────────┴─────────────┴─────────────┘
                        │
                  ┌─────▼─────┐
                  │   HTTPS   │
                  │  (SSL)    │
                  └─────┬─────┘
          ┌─────────────┴─────────────┐
          │                           │
    ┌─────▼──────┐            ┌──────▼─────┐
    │   Vercel   │            │  Railway   │
    │  (Frontend)│            │ (Backend)  │
    │            │            │            │
    │  Next.js   │◄──────────►│ Express.js │
    │  App Router│   API      │  + Socket  │
    │  Tailwind  │  Calls     │  Prisma    │
    └─────┬──────┘            └──────┬─────┘
          │                          │
          │                          │
          │                   ┌──────▼──────┐
          │                   │  PostgreSQL │
          │                   │   Database  │
          │                   │  (15 Models)│
          │                   └─────────────┘
          │
    ┌─────▼──────┐
    │   Users    │
    │  Browser   │
    │   Mobile   │
    └────────────┘
```

---

## 📦 Component Breakdown

### 1. Frontend (Vercel)

**Location:** `apps/web/`

**Technologies:**
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- shadcn/ui components
- Chart.js (analytics)
- Socket.IO client (real-time)

**Key Features:**
- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- API route handlers
- Middleware for auth
- i18n (EN/SW)
- Dark mode
- Responsive design

**Pages:**
```
/ (Home)
/about
/services
/book
/contact
/login
/register
/dashboard
  ├── /bookings
  ├── /requests
  ├── /payments
  ├── /documents
  └── /notifications
/admin
  ├── /users
  ├── /bookings
  ├── /requests
  ├── /verifications
  ├── /payments
  └── /notifications
```

---

### 2. Backend API (Railway)

**Location:** `apps/api/`

**Technologies:**
- Express.js
- TypeScript
- Prisma ORM
- Socket.IO
- JWT authentication
- Zod validation

**Architecture:**
```
src/
├── server.ts          # Entry point
├── app.ts             # Express app setup
├── socket.ts          # Socket.IO configuration
├── routes/            # API endpoints
│   ├── auth.ts
│   ├── bookings.ts
│   ├── requests.ts
│   ├── payments.ts
│   └── ...
├── controllers/       # Request handlers
├── services/          # Business logic
├── middleware/        # Auth, logging, security
└── validators/        # Zod schemas
```

**API Endpoints:**
```
Authentication:
  POST   /auth/register
  POST   /auth/login
  POST   /auth/logout
  POST   /auth/forgot-password
  POST   /auth/reset-password
  GET    /auth/me
  GET    /auth/verify-email

Bookings:
  POST   /bookings
  GET    /bookings
  GET    /bookings/:id
  PUT    /bookings/:id

Requests:
  POST   /requests
  GET    /requests
  PUT    /requests/:id

Payments:
  POST   /payments
  GET    /payments
  POST   /payments/mpesa-callback

Admin:
  GET    /admin/stats
  GET    /admin/analytics
  GET    /admin/users
  POST   /admin/notifications/broadcast
```

---

### 3. Database (Railway PostgreSQL)

**Location:** `packages/db/prisma/schema.prisma`

**Models (15 total):**

```
User
├── id, email, passwordHash
├── role (GUEST|CLIENT|STAFF|ADMIN|FOUNDER)
├── bookings, requests, payments
└── notificationPreferences

Booking
├── id, userId, serviceType
├── status (NEW|PENDING|SCHEDULED|IN_PROGRESS|COMPLETED|CANCELLED)
├── payments, messages
└── scheduledAt

ServiceRequest
├── id, userId, title, description
├── priority (LOW|MEDIUM|HIGH|URGENT)
├── status (OPEN|ASSIGNED|IN_PROGRESS|COMPLETED|CANCELLED)
├── verifications, notes
└── assignedTo, dueDate

Verification
├── id, requestId
├── location, result, reportUrl
├── evidenceUrl, conductedBy
└── conductedAt

Payment
├── id, userId, bookingId
├── amount, currency (KES)
├── status (PENDING|PAID|FAILED|REFUNDED)
├── method (MPESA|BANK_TRANSFER|CARD|CASH)
└── reference, paidAt

Document
├── id, userId, requestId
├── name, type, url
├── size, uploadedAt
└── ...

Note
├── id, userId, requestId
├── content, authorId
└── ...

BlogPost
├── id, title, slug
├── content, excerpt
├── author, imageUrl
└── published, publishedAt

Testimonial
├── id, name, role
├── content, rating
├── avatarUrl, featured
└── ...

NotificationPreference
├── id, userId (unique)
├── email, sms, whatsapp, push
└── marketing

Message
├── id, bookingId, senderId
├── content, readAt
└── createdAt

AuditLog
├── id, userId, action
├── entity, entityId
├── details (JSON), ipAddress
└── createdAt

Invoice
├── id, userId, bookingId
├── number (unique), amount
├── status, dueDate
└── issuedAt, paidAt
```

---

### 4. Shared Packages

**Location:** `packages/shared/`

**Purpose:** Shared TypeScript types and validators

**Exports:**
```typescript
// Types
export type Role = "GUEST" | "CLIENT" | "STAFF" | "ADMIN" | "FOUNDER"
export type BookingStatus = "NEW" | "PENDING_REVIEW" | ...
export type RequestPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"
export type PaymentStatus = "PENDING" | "PAID" | ...
export type ServiceType = "LAND_VERIFICATION" | ...

// Interfaces
export interface ApiResponse<T>
export interface PaginatedResponse<T>
export interface AuthPayload
export interface BookingInput
export interface RequestInput
```

---

## 🔄 Data Flow

### User Registration Flow

```
User → Frontend → POST /auth/register → Backend
                                           ↓
                                    Validate (Zod)
                                           ↓
                                    Hash Password (bcrypt)
                                           ↓
                                    Create User (Prisma)
                                           ↓
                                    Generate JWT
                                           ↓
                                    Send Verification Email
                                           ↓
                                    Return Token
                                           ↓
Frontend ← Store Cookie ← Set HTTP-only Cookie
   ↓
Dashboard Redirect
```

### Booking Creation Flow

```
User → Dashboard → Book Service → Frontend Form
                                    ↓
                            POST /bookings (JWT)
                                    ↓
                              Backend Auth
                                    ↓
                            Validate Input
                                    ↓
                            Create Booking (Prisma)
                                    ↓
                            Trigger Notification
                                    ↓
                              Send Email
                                    ↓
                            Return Booking
                                    ↓
Frontend ← Update UI ← Show Confirmation
```

### Real-time Chat Flow

```
User A → Chat Widget → Socket.IO Connect (JWT Auth)
                              ↓
                        Join Room: booking:123
                              ↓
User B → Chat Widget → Socket.IO Connect (JWT Auth)
                              ↓
                        Join Room: booking:123
                              ↓
User A: "Hello!" → emit("message:send", {bookingId, content})
                              ↓
                        Save to DB (Message model)
                              ↓
                        emit("message:new", message)
                              ↓
                  Room: booking:123 receives
                              ↓
                  User A & B see message
```

---

## 🔐 Security Architecture

### Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. POST /auth/login (email, password)
       ▼
┌─────────────┐
│   Express   │
│  Validator  │ (Zod schema)
└──────┬──────┘
       │
       │ 2. Find User (Prisma)
       ▼
┌─────────────┐
│  Database   │
└──────┬──────┘
       │
       │ 3. Verify Password (bcrypt)
       ▼
┌─────────────┐
│   Express   │
└──────┬──────┘
       │
       │ 4. Sign JWT (userId, role)
       ▼
┌─────────────┐
│   Client    │◄── HTTP-only Cookie (token)
└─────────────┘
```

### Authorization Middleware

```typescript
// Route protection
router.get("/admin/users", authenticate, authorize("ADMIN"), handler)

// authenticate() verifies JWT
// authorize() checks role
```

### Security Layers

```
┌─────────────────────────────────────┐
│         Security Layers             │
├─────────────────────────────────────┤
│ 1. HTTPS (SSL/TLS)                  │
│ 2. JWT Authentication               │
│ 3. Role-Based Access Control        │
│ 4. Rate Limiting (global + auth)    │
│ 5. Helmet Security Headers          │
│ 6. CORS Configuration               │
│ 7. CSRF Protection                  │
│ 8. Input Validation (Zod)           │
│ 9. SQL Injection Prevention (Prisma)│
│ 10. Audit Logging                   │
└─────────────────────────────────────┘
```

---

## 🌐 Deployment Architecture

### Vercel (Frontend)

```
┌─────────────────────────────────────┐
│           Vercel Edge Network        │
│  ┌──────────────────────────────┐   │
│  │  CDN (Cached Static Assets)  │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  Next.js Serverless Functions│   │
│  │  - SSR Pages                 │   │
│  │  - API Routes                │   │
│  │  - Middleware                │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Railway (Backend)

```
┌─────────────────────────────────────┐
│          Railway Platform           │
│  ┌──────────────────────────────┐   │
│  │   Express.js Container       │   │
│  │   - API Routes               │   │
│  │   - Socket.IO Server         │   │
│  │   - Services                 │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │   PostgreSQL Database        │   │
│  │   - Prisma ORM               │   │
│  │   - Connection Pooling       │   │
│  │   - Auto Backups             │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 📊 Monitoring & Observability

```
┌──────────────────────────────────────────┐
│          Monitoring Stack                │
├──────────────────────────────────────────┤
│ Sentry (Error Tracking)                  │
│  - Frontend errors                       │
│  - Backend errors                        │
│  - Performance monitoring                │
├──────────────────────────────────────────┤
│ Railway Metrics                          │
│  - CPU usage                             │
│  - Memory usage                          │
│  - Network I/O                           │
│  - Database connections                  │
├──────────────────────────────────────────┤
│ Vercel Analytics                         │
│  - Page views                            │
│  - Visitor geography                     │
│  - Core Web Vitals                       │
│  - Function duration                     │
├──────────────────────────────────────────┤
│ Application Logs                         │
│  - Railway logs (backend)                │
│  - Vercel logs (frontend)                │
│  - Audit logs (database)                 │
└──────────────────────────────────────────┘
```

---

## 🔄 CI/CD Pipeline

```
┌──────────────────────────────────────────┐
│         GitHub Actions Workflow          │
├──────────────────────────────────────────┤
│ 1. Push to main branch                   │
│         ↓                                │
│ 2. Quality Check (lint + build)          │
│         ↓                                │
│ 3. Test Suite (Vitest)                   │
│         ↓                                │
│ 4. Deploy Frontend (Vercel)              │
│         ↓                                │
│ 5. Deploy Backend (Railway hook)         │
│         ↓                                │
│ 6. Create Sentry Release                 │
│         ↓                                │
│ 7. Success! 🎉                           │
└──────────────────────────────────────────┘
```

---

## 💾 State Management

### Frontend State

```
┌─────────────────────────────────┐
│     Client-Side State           │
├─────────────────────────────────┤
│ React State (useState)          │
│  - Form inputs                  │
│  - UI toggles                   │
│  - Local data                   │
├─────────────────────────────────┤
│ React Hooks (useFetch)          │
│  - API data fetching            │
│  - Caching                      │
│  - Error handling               │
├─────────────────────────────────┤
│ localStorage                    │
│  - Theme preference             │
│  - Locale (EN/SW)               │
│  - Auth token (cookie)          │
└─────────────────────────────────┘
```

### Backend State

```
┌─────────────────────────────────┐
│     Server-Side State           │
├─────────────────────────────────┤
│ Database (PostgreSQL)           │
│  - Persistent data              │
│  - Relations (Prisma)           │
│  - Transactions                 │
├─────────────────────────────────┤
│ In-Memory Cache (optional)      │
│  - Frequently accessed data     │
│  - Session data                 │
├─────────────────────────────────┤
│ Socket.IO Rooms                 │
│  - Real-time connections        │
│  - Booking-specific rooms       │
└─────────────────────────────────┘
```

---

## 📱 User Experience Flow

### Booking Journey

```
1. Landing Page
   ↓
2. Browse Services
   ↓
3. Click "Book Now"
   ↓
4. Login/Register
   ↓
5. Fill Booking Form
   ↓
6. Submit
   ↓
7. Confirmation Email
   ↓
8. Dashboard Shows Booking
   ↓
9. Admin Reviews
   ↓
10. Status Updates
    ↓
11. Service Completed
    ↓
12. Payment
    ↓
13. Review/Testimonial
```

---

## 🎯 Key Architectural Decisions

### Why Monorepo?
- ✅ Shared types between frontend/backend
- ✅ Single source of truth
- ✅ Easier refactoring
- ✅ Consistent tooling

### Why Next.js?
- ✅ SSR for SEO
- ✅ App Router for modern patterns
- ✅ Vercel integration
- ✅ Built-in optimization

### Why Express.js?
- ✅ Mature ecosystem
- ✅ Socket.IO integration
- ✅ Easy to scale
- ✅ Railway compatibility

### Why Prisma?
- ✅ Type-safe queries
- ✅ Auto-completion
- ✅ Migrations
- ✅ Easy relations

### Why Railway?
- ✅ One-click PostgreSQL
- ✅ Auto-scaling
- ✅ Simple deployment
- ✅ Affordable pricing

### Why Vercel?
- ✅ Global CDN
- ✅ Edge functions
- ✅ Next.js creators
- ✅ Zero config

---

## 📈 Scalability Considerations

### Current Architecture
- Handles: ~1,000 concurrent users
- Database: Single PostgreSQL instance
- API: Single Express.js instance
- Frontend: Global CDN

### Scaling Paths

**Horizontal:**
- Add more Railway replicas
- Use Redis for caching
- Implement load balancer

**Vertical:**
- Upgrade Railway plan
- Increase database resources
- Optimize queries

**Database:**
- Read replicas
- Connection pooling
- Query optimization
- Indexing strategy

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Multi-language (more than EN/SW)
- [ ] Payment plans/subscriptions
- [ ] API webhooks
- [ ] Webhook integrations (Zapier)
- [ ] Advanced reporting
- [ ] Bulk operations
- [ ] Team collaboration

### Infrastructure
- [ ] Redis caching
- [ ] Message queue (Bull/RabbitMQ)
- [ ] Elasticsearch (search)
- [ ] CDN for uploads
- [ ] Multi-region deployment
- [ ] Kubernetes (if needed)

---

**This architecture provides a solid foundation for a production-ready diaspora operations platform! 🚀**