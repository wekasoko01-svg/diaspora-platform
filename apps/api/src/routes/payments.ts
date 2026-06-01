import { Router } from "express"
import * as paymentController from "../controllers/payments"
import { authenticate } from "../middleware/auth"
import { validate } from "../middleware/validate"
import { paymentSchema } from "../validators"

export const paymentsRouter = Router()

paymentsRouter.use(authenticate)
paymentsRouter.post("/", validate(paymentSchema), paymentController.create)
paymentsRouter.get("/", paymentController.list)
