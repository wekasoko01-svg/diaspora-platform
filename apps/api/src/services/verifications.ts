import { prisma } from "@diaspora/db"

export async function createVerification(data: {
  requestId: string
  location: string
  result?: string
  reportUrl?: string
  evidenceUrl?: string
  conductedBy?: string
  notes?: string
}) {
  return prisma.verification.create({
    data: { ...data, conductedAt: new Date() },
  })
}

export async function getVerificationsByRequest(requestId: string) {
  return prisma.verification.findMany({ where: { requestId }, orderBy: { createdAt: "desc" } })
}
