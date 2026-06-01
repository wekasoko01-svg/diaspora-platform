import { prisma } from "@diaspora/db"

export async function getPreferences(userId: string) {
  let prefs = await prisma.notificationPreference.findUnique({ where: { userId } })
  if (!prefs) {
    prefs = await prisma.notificationPreference.create({
      data: { userId },
    })
  }
  return prefs
}

export async function updatePreferences(userId: string, data: Partial<{
  email: boolean
  sms: boolean
  whatsapp: boolean
  push: boolean
  marketing: boolean
}>) {
  return prisma.notificationPreference.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  })
}

export async function shouldNotify(userId: string, channel: "email" | "sms" | "whatsapp" | "push") {
  const prefs = await getPreferences(userId)
  return prefs[channel] === true
}
