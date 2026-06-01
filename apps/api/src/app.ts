import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
import { authRouter } from "./routes/auth"
import { bookingsRouter } from "./routes/bookings"
import { requestsRouter } from "./routes/requests"
import { verificationsRouter } from "./routes/verifications"
import { paymentsRouter } from "./routes/payments"
import { documentsRouter } from "./routes/documents"
import { adminRouter } from "./routes/admin"
import { notificationsRouter } from "./routes/notifications"
import { adminNotificationsRouter } from "./routes/adminNotifications"
import { messagesRouter } from "./routes/messages"
import { errorHandler } from "./middleware/errorHandler"
import { securityHeaders, rateLimiter, authRateLimiter } from "./middleware/security"
import { auditLog } from "./middleware/auditLog"

const app = express()

app.use(securityHeaders)
app.use(rateLimiter)
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.json({ limit: "10mb" }))
app.use(cookieParser())
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")))

app.use("/auth", authRateLimiter, authRouter)
app.use("/bookings", bookingsRouter)
app.use("/requests", requestsRouter)
app.use("/verifications", verificationsRouter)
app.use("/payments", paymentsRouter)
app.use("/documents", documentsRouter)

app.use("/admin", adminRouter)
app.use("/admin/notifications", adminNotificationsRouter)
app.use("/notifications", notificationsRouter)
app.use("/messages", messagesRouter)

app.use("/bookings", auditLog("booking_created", "Booking"))
app.use("/payments", auditLog("payment_created", "Payment"))
app.use("/verifications", auditLog("verification_created", "Verification"))
app.use("/documents", auditLog("document_uploaded", "Document"))

app.get("/health", async (_req, res) => {
  const { prisma } = await import("@diaspora/db")
  const start = process.uptime()
  let dbStatus = "healthy"

  try {
    await prisma.$queryRaw`SELECT 1`
  } catch {
    dbStatus = "unhealthy"
  }

  res.json({
    status: dbStatus === "healthy" ? "healthy" : "degraded",
    uptime: Math.floor(start),
    database: dbStatus,
    version: process.env.npm_package_version ?? "0.1.0",
    node: process.version,
    environment: process.env.NODE_ENV ?? "development",
    timestamp: new Date().toISOString(),
  })
})

app.use(errorHandler)

export default app
