import { Router } from "express"
import * as bookingController from "../controllers/bookings"
import { authenticate } from "../middleware/auth"
import { validate } from "../middleware/validate"
import { bookingSchema } from "../validators"

export const bookingsRouter = Router()

bookingsRouter.use(authenticate)
bookingsRouter.post("/", validate(bookingSchema), bookingController.create)
bookingsRouter.get("/", bookingController.list)
bookingsRouter.get("/:id", bookingController.getById)
bookingsRouter.patch("/:id", bookingController.update)
