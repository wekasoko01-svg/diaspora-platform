import { Request, Response, NextFunction } from "express"
import { prisma } from "@diaspora/db"

export function auditLog(action: string, entity: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res)

    res.json = function (body: any) {
      if (req.user && res.statusCode < 500) {
        const entityId = req.params.id || req.body?.id || body?.data?.id || null
        prisma.auditLog.create({
          data: {
            userId: req.user.userId,
            action,
            entity,
            entityId: entityId as string | undefined,
            details: { method: req.method, path: req.originalUrl, statusCode: res.statusCode },
            ipAddress: req.ip || req.socket.remoteAddress || null,
          },
        }).catch((err) => console.error("[AUDIT] Failed to log:", err.message))
      }
      return originalJson(body)
    }

    next()
  }
}
