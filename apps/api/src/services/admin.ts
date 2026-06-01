import { prisma } from "@diaspora/db"

export async function getDashboardStats() {
  const [totalUsers, totalBookings, totalRequests, pendingBookings, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.serviceRequest.count(),
    prisma.booking.count({ where: { status: "NEW" } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "PAID" } }),
  ])

  return { totalUsers, totalBookings, totalRequests, pendingBookings, revenue: revenue._sum.amount ?? 0 }
}

export async function getAllUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, fullName: true, email: true, role: true, country: true, createdAt: true } })
}

export async function getAuditLogs(limit = 50) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { fullName: true, email: true } } },
  })
}

export async function getAnalytics() {
  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  const [bookings, payments, users, requests] = await Promise.all([
    prisma.booking.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true, status: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.payment.findMany({
      where: { createdAt: { gte: sixMonthsAgo }, status: "PAID" },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true, role: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.serviceRequest.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true, status: true },
      orderBy: { createdAt: "asc" },
    }),
  ])

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    return d.toLocaleString("en", { month: "short", year: "2-digit" })
  })

  const bucket = (items: { createdAt: Date }[], valueKey?: string) =>
    months.map((_, i) => {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - 4 + i, 1)
      return items
        .filter((item) => item.createdAt >= monthStart && item.createdAt < monthEnd)
        .reduce((sum, item: any) => sum + (valueKey ? Number(item[valueKey] ?? 0) : 1), 0)
    })

  return {
    months,
    bookingsByMonth: bucket(bookings),
    revenueByMonth: bucket(payments, "amount"),
    usersByMonth: bucket(users),
    requestsByMonth: bucket(requests),
  }
}

export async function getAllBookings() {
  return prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { fullName: true, email: true } } },
  })
}

export async function getAllRequests() {
  return prisma.serviceRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { fullName: true, email: true } } },
  })
}

export async function getAllPayments() {
  return prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { fullName: true, email: true } } },
  })
}

export async function getAllVerifications() {
  return prisma.verification.findMany({
    orderBy: { createdAt: "desc" },
    include: { request: { select: { title: true } } },
  })
}
