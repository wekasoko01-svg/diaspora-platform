import { Request, Response } from "express"
import * as adminService from "../services/admin"

export async function getStats(_req: Request, res: Response) {
  const stats = await adminService.getDashboardStats()
  res.json({ success: true, data: stats })
}

export async function getUsers(_req: Request, res: Response) {
  const users = await adminService.getAllUsers()
  res.json({ success: true, data: users })
}

export async function getAuditLogs(_req: Request, res: Response) {
  const logs = await adminService.getAuditLogs()
  res.json({ success: true, data: logs })
}

export async function getBookings(_req: Request, res: Response) {
  const bookings = await adminService.getAllBookings()
  res.json({ success: true, data: bookings })
}

export async function getRequests(_req: Request, res: Response) {
  const requests = await adminService.getAllRequests()
  res.json({ success: true, data: requests })
}

export async function getPayments(_req: Request, res: Response) {
  const payments = await adminService.getAllPayments()
  res.json({ success: true, data: payments })
}

export async function getVerifications(_req: Request, res: Response) {
  const verifications = await adminService.getAllVerifications()
  res.json({ success: true, data: verifications })
}

export async function getAnalytics(_req: Request, res: Response) {
  const analytics = await adminService.getAnalytics()
  res.json({ success: true, data: analytics })
}
