import { prisma } from "@diaspora/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production"
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3000"

export async function register(data: { fullName: string; email: string; phone: string; password: string; country?: string }) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) throw new Error("Email already registered")

  const passwordHash = await bcrypt.hash(data.password, 12)
  const verificationToken = crypto.randomBytes(32).toString("hex")

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName, email: data.email, phone: data.phone,
      passwordHash, country: data.country,
      verificationToken,
      verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  })

  const { sendVerificationEmail } = await import("./email")
  await sendVerificationEmail(user.email, user.fullName, verificationToken)

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" })
  return { user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }, token }
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error("Invalid email or password")

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw new Error("Invalid email or password")

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" })
  return { user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, emailVerified: user.emailVerified }, token }
}

export async function verifyEmail(token: string) {
  const user = await prisma.user.findUnique({ where: { verificationToken: token } })
  if (!user) throw new Error("Invalid or expired verification token")
  if (user.verificationExpires && user.verificationExpires < new Date()) throw new Error("Verification token expired")

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, verificationToken: null, verificationExpires: null },
  })
  return { message: "Email verified successfully" }
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return { message: "If that email exists, a reset link has been sent" }

  const resetToken = crypto.randomBytes(32).toString("hex")
  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetExpires: new Date(Date.now() + 60 * 60 * 1000) },
  })

  const { sendPasswordReset } = await import("./email")
  await sendPasswordReset(user.email, resetToken)

  return { message: "If that email exists, a reset link has been sent" }
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { resetToken: token } })
  if (!user) throw new Error("Invalid or expired reset token")
  if (user.resetExpires && user.resetExpires < new Date()) throw new Error("Reset token expired")

  const passwordHash = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetToken: null, resetExpires: null },
  })
  return { message: "Password reset successfully" }
}

export async function resendVerification(email: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error("User not found")
  if (user.emailVerified) throw new Error("Email already verified")

  const verificationToken = crypto.randomBytes(32).toString("hex")
  await prisma.user.update({
    where: { id: user.id },
    data: { verificationToken, verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) },
  })

  const { sendVerificationEmail } = await import("./email")
  await sendVerificationEmail(user.email, user.fullName, verificationToken)

  return { message: "Verification email sent" }
}
