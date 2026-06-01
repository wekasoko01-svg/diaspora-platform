import { Router } from "express"
import * as authController from "../controllers/auth"
import { authenticate } from "../middleware/auth"
import { validate } from "../middleware/validate"
import { registerSchema, loginSchema } from "../validators"

export const authRouter = Router()

authRouter.post("/register", validate(registerSchema), authController.register)
authRouter.post("/login", validate(loginSchema), authController.login)
authRouter.post("/logout", authController.logout)
authRouter.get("/me", authenticate, authController.me)
authRouter.get("/verify-email", authController.verifyEmailHandler)
authRouter.post("/forgot-password", authController.forgotPasswordHandler)
authRouter.post("/reset-password", authController.resetPasswordHandler)
authRouter.post("/resend-verification", authController.resendVerificationHandler)
