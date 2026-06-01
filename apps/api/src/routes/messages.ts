import { Router } from "express"
import { authenticate } from "../middleware/auth"
import * as messagingService from "../services/messaging"

export const messagesRouter = Router()

messagesRouter.use(authenticate)

messagesRouter.get("/:bookingId", async (req, res) => {
  const messages = await messagingService.getMessages(req.params.bookingId)
  res.json({ success: true, data: messages })
})
