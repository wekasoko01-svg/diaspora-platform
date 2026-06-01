import { Router } from "express"
import multer from "multer"
import * as documentController from "../controllers/documents"
import { authenticate } from "../middleware/auth"

const upload = multer({ dest: process.env.UPLOAD_DIR ?? "./uploads" })

export const documentsRouter = Router()

documentsRouter.use(authenticate)
documentsRouter.get("/", documentController.list)
documentsRouter.post("/upload", upload.single("file"), documentController.upload)
