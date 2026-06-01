import { Router } from "express"
import { authenticate, authorize } from "../middleware/auth"
import * as adminNotificationController from "../controllers/adminNotifications"

export const adminNotificationsRouter = Router()

adminNotificationsRouter.use(authenticate)
adminNotificationsRouter.use(authorize("ADMIN", "FOUNDER"))

adminNotificationsRouter.get("/", adminNotificationController.getNotifications)
adminNotificationsRouter.post("/broadcast", adminNotificationController.broadcast)
