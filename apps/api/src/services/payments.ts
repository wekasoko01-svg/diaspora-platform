import { prisma } from "@diaspora/db"

export async function createPayment(data: {
  userId: string
  bookingId?: string
  amount: number
  currency: string
  method?: string
  reference?: string
}) {
  return prisma.payment.create({
    data: {
      userId: data.userId,
      bookingId: data.bookingId,
      amount: data.amount,
      currency: data.currency,
      method: data.method as any,
      reference: data.reference,
      status: "PENDING",
    },
  })
}

export async function getUserPayments(userId: string) {
  return prisma.payment.findMany({ where: { userId }, orderBy: { createdAt: "desc" } })
}
