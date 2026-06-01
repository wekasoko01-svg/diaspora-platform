import { Request, Response } from "express"
import * as adminNotificationService from "../services/adminNotifications"

export async function getNotifications(_req: Request, res: Response) {
  const notifications = await adminNotificationService.getAllNotifications()
  res.json({ success: true, data: notifications })
}

export async function broadcast(_req: Request, res: Response) {
  try {
    const result = await adminNotificationService.broadcastEmail(_req.body)
    res.json({ success: true, data: result })
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message })
  }
}
