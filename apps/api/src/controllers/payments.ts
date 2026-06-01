import { Request, Response } from "express"
import * as paymentService from "../services/payments"

export async function create(req: Request, res: Response) {
  try {
    const payment = await paymentService.createPayment({ ...req.body, userId: req.user!.userId })
    const { notifyPaymentReceived } = await import("../services/notificationTriggers")
    const { prisma } = await import("@diaspora/db")
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId }, select: { email: true, fullName: true, phone: true } })
    if (user) notifyPaymentReceived({ ...payment, amount: Number(payment.amount) }, user)
    res.status(201).json({ success: true, data: payment })
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message })
  }
}

export async function list(req: Request, res: Response) {
  const payments = await paymentService.getUserPayments(req.user!.userId)
  res.json({ success: true, data: payments })
}
