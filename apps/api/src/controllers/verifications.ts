import { Request, Response } from "express"
import * as verificationService from "../services/verifications"

export async function create(req: Request, res: Response) {
  try {
    const verification = await verificationService.createVerification({ ...req.body, conductedBy: req.user!.userId })
    const { notifyVerificationCompleted } = await import("../services/notificationTriggers")
    const { prisma } = await import("@diaspora/db")
    const request_ = await prisma.serviceRequest.findUnique({ where: { id: verification.requestId }, include: { user: { select: { email: true, fullName: true } } } })
    if (request_) notifyVerificationCompleted(verification, request_.user)
    res.status(201).json({ success: true, data: verification })
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message })
  }
}

export async function listByRequest(req: Request, res: Response) {
  const verifications = await verificationService.getVerificationsByRequest(req.params.requestId)
  res.json({ success: true, data: verifications })
}
