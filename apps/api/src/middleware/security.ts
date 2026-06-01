import helmet from "helmet"
import rateLimit from "express-rate-limit"
import csrf from "csurf"

export const securityHeaders = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
})

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests, please try again later" },
})

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many login attempts, please try again later" },
})

export const csrfProtection = csrf({ cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" } })
