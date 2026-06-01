import { prisma } from "@diaspora/db"
import type { BookingInput } from "@diaspora/shared"

export async function createBooking(userId: string, data: BookingInput) {
  return prisma.booking.create({
    data: {
      userId,
      serviceType: data.serviceType,
      message: data.message,
      budget: data.budget,
      priority: data.priority,
      scheduledAt: data.timeline ? new Date(data.timeline) : null,
    },
  })
}

export async function getBookings(userId: string) {
  return prisma.booking.findMany({ where: { userId }, orderBy: { createdAt: "desc" } })
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({ where: { id }, include: { payments: true } })
}

export async function updateBookingStatus(id: string, status: string) {
  return prisma.booking.update({ where: { id }, data: { status: status as any } })
}
