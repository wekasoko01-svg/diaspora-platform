import { Router } from "express"
import * as requestController from "../controllers/requests"
import { authenticate } from "../middleware/auth"
import { validate } from "../middleware/validate"
import { requestSchema } from "../validators"

export const requestsRouter = Router()

requestsRouter.use(authenticate)
requestsRouter.post("/", validate(requestSchema), requestController.create)
requestsRouter.get("/", requestController.list)
requestsRouter.get("/:id", requestController.getById)
requestsRouter.patch("/:id", requestController.update)
