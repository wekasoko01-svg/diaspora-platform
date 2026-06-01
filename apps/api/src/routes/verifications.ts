import { Router } from "express"
import * as verificationController from "../controllers/verifications"
import { authenticate, authorize } from "../middleware/auth"

export const verificationsRouter = Router()

verificationsRouter.use(authenticate)
verificationsRouter.post("/", authorize("STAFF", "ADMIN", "FOUNDER"), verificationController.create)
verificationsRouter.get("/request/:requestId", verificationController.listByRequest)
