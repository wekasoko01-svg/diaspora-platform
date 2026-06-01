import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { AuthPayload } from "@diaspora/shared"

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production"

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token ?? req.headers.authorization?.replace("Bearer ", "")

  if (!token) {
    return res.status(401).json({ success: false, error: "Authentication required" })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ success: false, error: "Invalid or expired token" })
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: "Insufficient permissions" })
    }
    next()
  }
}
