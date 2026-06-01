import { prisma } from "@diaspora/db"

export async function createRequest(userId: string, data: { title: string; description: string; priority: string; dueDate?: string }) {
  return prisma.serviceRequest.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      priority: data.priority as any,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    },
  })
}

export async function getRequests(userId: string) {
  return prisma.serviceRequest.findMany({ where: { userId }, orderBy: { createdAt: "desc" } })
}

export async function getRequestById(id: string) {
  return prisma.serviceRequest.findUnique({
    where: { id },
    include: { verifications: true, notes: true },
  })
}

export async function updateRequestStatus(id: string, status: string, assignedTo?: string) {
  return prisma.serviceRequest.update({
    where: { id },
    data: { status: status as any, ...(assignedTo ? { assignedTo } : {}) },
  })
}
