import { Router } from "express"
import * as adminController from "../controllers/admin"
import { authenticate, authorize } from "../middleware/auth"

export const adminRouter = Router()

adminRouter.use(authenticate)
adminRouter.use(authorize("ADMIN", "FOUNDER"))
adminRouter.get("/stats", adminController.getStats)
adminRouter.get("/analytics", adminController.getAnalytics)
adminRouter.get("/users", adminController.getUsers)
adminRouter.get("/bookings", adminController.getBookings)
adminRouter.get("/requests", adminController.getRequests)
adminRouter.get("/payments", adminController.getPayments)
adminRouter.get("/verifications", adminController.getVerifications)
adminRouter.get("/audit-logs", adminController.getAuditLogs)
