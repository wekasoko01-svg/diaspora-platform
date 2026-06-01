import type { Request, Response } from "express"
import * as notificationService from "../services/notifications"

export async function getPreferencesHandler(req: Request, res: Response) {
  const prefs = await notificationService.getPreferences(req.user!.userId)
  res.json({ success: true, data: prefs })
}

export async function updatePreferencesHandler(req: Request, res: Response) {
  const { email, sms, whatsapp, push, marketing } = req.body
  const prefs = await notificationService.updatePreferences(req.user!.userId, {
    email, sms, whatsapp, push, marketing,
  })
  res.json({ success: true, data: prefs })
}
