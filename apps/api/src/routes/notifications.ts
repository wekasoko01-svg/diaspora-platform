import { Router } from "express"
import { authenticate } from "../middleware/auth"
import * as notificationController from "../controllers/notifications"

export const notificationsRouter = Router()

notificationsRouter.use(authenticate)

notificationsRouter.get("/preferences", notificationController.getPreferencesHandler)
notificationsRouter.put("/preferences", notificationController.updatePreferencesHandler)
