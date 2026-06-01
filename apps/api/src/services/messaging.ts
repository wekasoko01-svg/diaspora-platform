import { prisma } from "@diaspora/db"

export async function sendMessage(data: {
  bookingId: string
  senderId: string
  content: string
}) {
  return prisma.message.create({
    data: {
      bookingId: data.bookingId,
      senderId: data.senderId,
      content: data.content,
    },
    include: { sender: { select: { id: true, fullName: true, role: true } } },
  })
}

export async function getMessages(bookingId: string) {
  return prisma.message.findMany({
    where: { bookingId },
    include: { sender: { select: { id: true, fullName: true, role: true } } },
    orderBy: { createdAt: "asc" },
  })
}

export async function markAsRead(messageId: string) {
  return prisma.message.update({
    where: { id: messageId },
    data: { readAt: new Date() },
  })
}
