import { prisma } from "@diaspora/db"
import * as emailService from "./email"
import * as twilioService from "./twilio"
import * as notificationPrefs from "./notifications"

async function checkPref(userId: string, channel: "email" | "sms" | "whatsapp") {
  try { return await notificationPrefs.shouldNotify(userId, channel) }
  catch { return true }
}

export async function notifyBookingCreated(booking: { id: string; userId: string; serviceType: string; message: string }, user: { email: string; fullName: string; phone: string }) {
  const sendEmail = await checkPref(booking.userId, "email")
  if (sendEmail) {
    await emailService.sendBookingConfirmation(user.email, user.fullName, booking.serviceType)
  }
  console.log(`[NOTIFY] Booking ${booking.id} created for ${user.fullName}`)
}

export async function notifyPaymentReceived(payment: { id: string; userId: string; amount: number; reference?: string | null }, user: { email: string; fullName: string; phone: string }) {
  const sendEmail = await checkPref(payment.userId, "email")
  if (sendEmail) {
    await emailService.sendNotificationEmail(
      user.email,
      "Payment Received",
      `<h2>Thank You!</h2><p>Hi ${user.fullName},</p><p>We've received your payment of KES ${payment.amount.toLocaleString()}${payment.reference ? ` (Ref: ${payment.reference})` : ""}.</p>`
    )
  }
  console.log(`[NOTIFY] Payment ${payment.id} (KES ${payment.amount}) received from ${user.fullName}`)
}

export async function notifyVerificationCompleted(verification: { id: string; requestId: string; result?: string | null }, user: { email: string; fullName: string }) {
  const sendEmail = await checkPref(user.email as any, "email")
  if (sendEmail) {
    await emailService.sendVerificationReport(user.email, verification.requestId, verification.result ?? "Completed")
  }
  console.log(`[NOTIFY] Verification ${verification.id} completed for ${user.fullName}`)
}
