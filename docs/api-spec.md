# API Specification

Base URL: `http://localhost:4000` (dev) or `https://api.yourdomain.com` (prod)

## Authentication

### POST /auth/register

Create a new client account.

```json
{ "fullName": "string", "email": "string", "phone": "string", "password": "string", "country?": "string" }
```

**Response**: `{ success: true, data: { id, fullName, email, role } }`
Sets httpOnly cookie with JWT token.

### POST /auth/login

Authenticate existing user.

```json
{ "email": "string", "password": "string" }
```

**Response**: `{ success: true, data: { id, fullName, email, role } }`
Sets httpOnly cookie with JWT token.

### POST /auth/logout

Clears auth cookie.

### GET /auth/me

**Auth required**. Returns current user payload from token.

---

## Bookings

All endpoints require authentication.

### POST /bookings

Create a new booking.

```json
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "countryOfResidence": "string",
  "serviceType": "LAND_VERIFICATION | CONSTRUCTION_MONITORING | VEHICLE_INSPECTION | RELOCATION_SUPPORT | FAMILY_SUPPORT | FRAUD_PREVENTION | DOCUMENT_FACILITATION | CONSULTATION",
  "budget?": "string",
  "priority?": "LOW | MEDIUM | HIGH | URGENT",
  "timeline?": "string (ISO date)",
  "message": "string (min 10 chars)"
}
```

### GET /bookings

List user's bookings.

### GET /bookings/:id

Get booking details including payments.

### PATCH /bookings/:id

Update booking status.

```json
{ "status": "NEW | PENDING_REVIEW | SCHEDULED | IN_PROGRESS | COMPLETED | CANCELLED" }
```

---

## Service Requests

All endpoints require authentication.

### POST /requests

```json
{ "title": "string (min 5)", "description": "string (min 10)", "priority?": "LOW | MEDIUM | HIGH | URGENT", "dueDate?": "ISO date string" }
```

### GET /requests

### GET /requests/:id

Includes verifications and notes.

### PATCH /requests/:id

```json
{ "status": "OPEN | ASSIGNED | IN_PROGRESS | UNDER_REVIEW | COMPLETED | CANCELLED", "assignedTo?": "userId" }
```

---

## Verifications

Requires STAFF, ADMIN, or FOUNDER role.

### POST /verifications

```json
{ "requestId": "string", "location": "string", "result?": "string", "reportUrl?": "string", "evidenceUrl?": "string", "notes?": "string" }
```

### GET /verifications/request/:requestId

---

## Payments

Requires authentication.

### POST /payments

```json
{ "bookingId?": "string", "amount": "number (positive)", "currency?": "string (default KES)", "method?": "MPESA | BANK_TRANSFER | CARD | CASH", "reference?": "string" }
```

### GET /payments

---

## Admin

Requires ADMIN or FOUNDER role.

### GET /admin/stats

Dashboard statistics: total users, bookings, requests, revenue.

### GET /admin/users

List all users.

### GET /admin/audit-logs

Recent audit log entries.

---

## Health Check

### GET /health

```json
{ "status": "ok", "timestamp": "2024-01-01T00:00:00.000Z" }
```

## Error Response Format

```json
{
  "success": false,
  "error": "Human-readable error message",
  "details?": { "fieldName": ["error message"] }
}
```
