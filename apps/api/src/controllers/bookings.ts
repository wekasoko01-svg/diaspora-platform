import { Request, Response } from "express"
import * as bookingService from "../services/bookings"

export async function create(req: Request, res: Response) {
  try {
    const booking = await bookingService.createBooking(req.user!.userId, req.body)
    const { notifyBookingCreated } = await import("../services/notificationTriggers")
    const { prisma } = await import("@diaspora/db")
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId }, select: { email: true, fullName: true, phone: true } })
    if (user) notifyBookingCreated(booking, user)
    res.status(201).json({ success: true, data: booking })
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message })
  }
}

export async function list(req: Request, res: Response) {
  const bookings = await bookingService.getBookings(req.user!.userId)
  res.json({ success: true, data: bookings })
}

export async function getById(req: Request, res: Response) {
  const booking = await bookingService.getBookingById(req.params.id)
  if (!booking) return res.status(404).json({ success: false, error: "Booking not found" })
  res.json({ success: true, data: booking })
}

export async function update(req: Request, res: Response) {
  const booking = await bookingService.updateBookingStatus(req.params.id, req.body.status)
  res.json({ success: true, data: booking })
}
