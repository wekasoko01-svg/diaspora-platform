import { prisma } from "@diaspora/db"
import * as emailService from "./email"

export async function getAllNotifications() {
  return prisma.auditLog.findMany({
    where: { action: { in: ["booking_created", "payment_received", "verification_completed", "user_registered"] } },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { fullName: true, email: true } } },
  })
}

export async function broadcastEmail(data: { subject: string; body: string; userIds?: string[] }) {
  const users = data.userIds
    ? await prisma.user.findMany({ where: { id: { in: data.userIds } }, select: { email: true, fullName: true } })
    : await prisma.user.findMany({ select: { email: true, fullName: true } })

  for (const user of users) {
    await emailService.sendNotificationEmail(user.email, data.subject, data.body)
  }
  return { sent: users.length }
}
