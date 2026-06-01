import { prisma } from "@diaspora/db"

export async function getDocuments(userId: string) {
  return prisma.document.findMany({ where: { userId }, orderBy: { createdAt: "desc" } })
}

export async function createDocument(data: { userId: string; name: string; type: string; url: string; size?: number; requestId?: string }) {
  return prisma.document.create({ data })
}
