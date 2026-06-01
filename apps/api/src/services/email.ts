import nodemailer from "nodemailer"

const from = process.env.EMAIL_FROM ?? "noreply@diasporalink.com"
const host = process.env.EMAIL_HOST ?? "localhost"
const port = parseInt(process.env.EMAIL_PORT ?? "1025")
const secure = process.env.EMAIL_SECURE === "true"
const user = process.env.EMAIL_USER ?? ""
const pass = process.env.EMAIL_PASS ?? ""

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      ...(user ? { auth: { user, pass } } : {}),
    })
  }
  return transporter
}

function isConfigured() {
  return host !== "localhost" || port !== 1025 || !!user
}

export async function sendContactNotification(name: string, email: string, phone: string, message: string) {
  if (!isConfigured()) { console.log(`[EMAIL] Contact from ${name} <${email}>: ${message.slice(0, 60)}...`); return }
  await getTransporter().sendMail({
    from, to: from, subject: `New Contact from ${name}`,
    html: `<h2>New Contact Message</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Message:</strong> ${message}</p>`,
  })
}

export async function sendBookingConfirmation(email: string, name: string, serviceType: string) {
  if (!isConfigured()) { console.log(`[EMAIL] Booking confirmation for ${name} <${email}>: ${serviceType}`); return }
  await getTransporter().sendMail({
    from, to: email, subject: `Booking Confirmed - ${serviceType}`,
    html: `<h2>Booking Confirmed</h2><p>Hi ${name},</p><p>Your ${serviceType} booking has been received. We'll contact you within 24 hours.</p>`,
  })
}

export async function sendPasswordReset(email: string, token: string) {
  if (!isConfigured()) { console.log(`[EMAIL] Password reset for ${email}: token=${token.slice(0, 8)}...`); return }
  await getTransporter().sendMail({
    from, to: email, subject: "Password Reset Request",
    html: `<h2>Password Reset</h2><p>Use this link to reset your password: <a href="${process.env.APP_URL ?? "http://localhost:3000"}/reset-password?token=${token}">Reset Password</a></p><p>This link expires in 1 hour.</p>`,
  })
}

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const url = `${process.env.APP_URL ?? "http://localhost:3000"}/verify-email?token=${token}`
  if (!isConfigured()) { console.log(`[EMAIL] Verify email for ${name} <${email}>: ${url}`); return }
  await getTransporter().sendMail({
    from, to: email, subject: "Verify Your Email — DiasporaLink",
    html: `<h2>Welcome to DiasporaLink!</h2><p>Hi ${name},</p><p>Please verify your email by clicking: <a href="${url}">Verify Email</a></p><p>Link expires in 24 hours.</p>`,
  })
}

export async function sendVerificationReport(email: string, requestId: string, result: string) {
  if (!isConfigured()) { console.log(`[EMAIL] Verification report for ${email} (${requestId}): ${result}`); return }
  await getTransporter().sendMail({
    from, to: email, subject: `Verification Result - ${requestId}`,
    html: `<h2>Verification Report</h2><p><strong>Request ID:</strong> ${requestId}</p><p><strong>Result:</strong> ${result}</p>`,
  })
}

export async function sendNotificationEmail(email: string, subject: string, html: string) {
  if (!isConfigured()) { console.log(`[EMAIL] Notification to ${email}: ${subject}`); return }
  await getTransporter().sendMail({ from, to: email, subject, html })
}
