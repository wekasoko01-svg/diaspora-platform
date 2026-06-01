import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12)
  const clientPassword = await bcrypt.hash("client123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@diaspora.com" },
    update: {},
    create: {
      fullName: "Admin User",
      email: "admin@diaspora.com",
      phone: "+254700000000",
      passwordHash: adminPassword,
      role: "ADMIN",
      country: "Kenya",
    },
  })

  const client = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      fullName: "Jane Client",
      email: "client@example.com",
      phone: "+254711000000",
      passwordHash: clientPassword,
      role: "CLIENT",
      country: "United States",
    },
  })

  await prisma.testimonial.createMany({
    data: [
      { name: "Mary W.", role: "Diaspora Client", content: "They verified my land title in just 3 days. Highly recommend.", rating: 5, featured: true },
      { name: "John K.", role: "Diaspora Client", content: "The construction monitoring gave me peace of mind while abroad.", rating: 5, featured: true },
    ],
    skipDuplicates: true,
  })

  await prisma.blogPost.createMany({
    data: [
      { title: "How to Verify Land Ownership in Kenya from Abroad", slug: "verify-land-ownership-kenya-abroad", excerpt: "A step-by-step guide for diaspora Kenyans.", content: "Full guide content here...", published: true, publishedAt: new Date() },
      { title: "5 Red Flags When Buying Property in Kenya", slug: "red-flags-buying-property-kenya", excerpt: "Watch out for these common property scams.", content: "Full article content here...", published: true, publishedAt: new Date() },
    ],
    skipDuplicates: true,
  })

  console.log("Seed data created successfully")
  console.log(`Admin: admin@diaspora.com / admin123`)
  console.log(`Client: client@example.com / client123`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
