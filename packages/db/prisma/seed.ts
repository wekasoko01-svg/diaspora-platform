import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  const hashedPassword = await bcrypt.hash("Admin123!", 12)
  const clientPassword = await bcrypt.hash("Client123!", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@diaspora.com" },
    update: {},
    create: {
      fullName: "Admin User",
      email: "admin@diaspora.com",
      phone: "+254700000001",
      passwordHash: hashedPassword,
      role: "ADMIN",
      country: "Kenya",
      emailVerified: true,
    },
  })
  console.log(`  ✓ Admin: ${admin.email} (Admin123!)`)

  const staff = await prisma.user.upsert({
    where: { email: "staff@diaspora.com" },
    update: {},
    create: {
      fullName: "Staff Member",
      email: "staff@diaspora.com",
      phone: "+254700000002",
      passwordHash: hashedPassword,
      role: "STAFF",
      country: "Kenya",
      emailVerified: true,
    },
  })
  console.log(`  ✓ Staff: ${staff.email} (Admin123!)`)

  const client = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      fullName: "Jane Doe",
      email: "client@example.com",
      phone: "+254700000003",
      passwordHash: clientPassword,
      role: "CLIENT",
      country: "United States",
      emailVerified: true,
    },
  })
  console.log(`  ✓ Client: ${client.email} (Client123!)`)

  const client2 = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      fullName: "John Smith",
      email: "john@example.com",
      phone: "+254700000004",
      passwordHash: clientPassword,
      role: "CLIENT",
      country: "United Kingdom",
      emailVerified: true,
    },
  })
  console.log(`  ✓ Client: ${client2.email} (Client123!)`)

  const services = [
    "LAND_VERIFICATION", "CONSTRUCTION_MONITORING", "VEHICLE_INSPECTION",
    "RELOCATION_SUPPORT", "FAMILY_SUPPORT", "FRAUD_PREVENTION",
    "DOCUMENT_FACILITATION", "CONSULTATION",
  ] as const

  for (let i = 1; i <= 3; i++) {
    await prisma.booking.upsert({
      where: { id: `seed-booking-${i}` },
      update: {},
      create: {
        id: `seed-booking-${i}`,
        userId: client.id,
        serviceType: services[i - 1],
        message: `Sample booking request ${i} for ${services[i - 1].replace(/_/g, " ").toLowerCase()}.`,
        budget: i === 1 ? "50000" : i === 2 ? "150000" : null,
        priority: i === 3 ? "HIGH" : "MEDIUM",
        status: i === 1 ? "NEW" : i === 2 ? "SCHEDULED" : "COMPLETED",
        scheduledAt: i === 2 ? new Date("2026-06-15") : null,
      },
    })
  }
  console.log("  ✓ 3 sample bookings")

  const requests = [
    { title: "Title deed verification", desc: "Need to verify authenticity of a title deed for parcel Nairobi/Block/123.", priority: "HIGH" as const },
    { title: "Property inspection request", desc: "Please inspect the construction progress at my plot in Ruiru.", priority: "MEDIUM" as const },
    { title: "Vehicle history check", desc: "Requesting a comprehensive history check for a Toyota V8.", priority: "LOW" as const },
  ]
  for (let i = 0; i < requests.length; i++) {
    await prisma.serviceRequest.upsert({
      where: { id: `seed-request-${i + 1}` },
      update: {},
      create: {
        id: `seed-request-${i + 1}`,
        userId: client.id,
        title: requests[i].title,
        description: requests[i].desc,
        priority: requests[i].priority,
        status: i === 0 ? "OPEN" : i === 1 ? "IN_PROGRESS" : "COMPLETED",
        assignedTo: i === 1 ? staff.id : null,
      },
    })
  }
  console.log("  ✓ 3 sample requests")

  await prisma.payment.upsert({
    where: { id: "seed-payment-1" },
    update: {},
    create: {
      id: "seed-payment-1",
      userId: client.id,
      bookingId: "seed-booking-3",
      amount: 25000,
      currency: "KES",
      status: "PAID",
      method: "MPESA",
      reference: "MPE-20260601-001",
      paidAt: new Date("2026-05-28"),
    },
  })
  await prisma.payment.upsert({
    where: { id: "seed-payment-2" },
    update: {},
    create: {
      id: "seed-payment-2",
      userId: client.id,
      bookingId: "seed-booking-2",
      amount: 75000,
      currency: "KES",
      status: "PENDING",
      method: "BANK_TRANSFER",
      notes: "Awaiting confirmation",
    },
  })
  console.log("  ✓ 2 sample payments")

  await prisma.invoice.upsert({
    where: { id: "seed-invoice-1" },
    update: {},
    create: {
      id: "seed-invoice-1",
      userId: client.id,
      bookingId: "seed-booking-3",
      number: "INV-2026-0001",
      amount: 25000,
      currency: "KES",
      status: "PAID",
      dueDate: new Date("2026-06-15"),
      issuedAt: new Date("2026-05-20"),
      paidAt: new Date("2026-05-28"),
    },
  })
  await prisma.invoice.upsert({
    where: { id: "seed-invoice-2" },
    update: {},
    create: {
      id: "seed-invoice-2",
      userId: client.id,
      bookingId: "seed-booking-2",
      number: "INV-2026-0002",
      amount: 75000,
      currency: "KES",
      status: "PENDING",
      dueDate: new Date("2026-07-01"),
      issuedAt: new Date("2026-06-01"),
    },
  })
  console.log("  ✓ 2 sample invoices")

  await prisma.verification.upsert({
    where: { id: "seed-verification-1" },
    update: {},
    create: {
      id: "seed-verification-1",
      requestId: "seed-request-2",
      location: "Ruiru, Kiambu County",
      result: "Construction is 65% complete. Foundation and framing done. Roofing in progress.",
      conductedBy: staff.id,
      conductedAt: new Date("2026-05-30"),
    },
  })
  console.log("  ✓ 1 sample verification")

  await prisma.document.upsert({
    where: { id: "seed-doc-1" },
    update: {},
    create: {
      id: "seed-doc-1",
      userId: client.id,
      requestId: "seed-request-1",
      name: "ID_Scan.pdf",
      type: "application/pdf",
      url: "/uploads/sample/ID_Scan.pdf",
      size: 245000,
    },
  })
  console.log("  ✓ 1 sample document")

  await prisma.blogPost.upsert({
    where: { id: "seed-blog-1" },
    update: {},
    create: {
      id: "seed-blog-1",
      title: "A Guide to Land Verification in Kenya for the Diaspora",
      slug: "land-verification-guide-kenya-diaspora",
      excerpt: "Everything you need to know about verifying land titles and properties from abroad.",
      content: "# Guide to Land Verification\n\nPurchasing land in Kenya while living abroad comes with unique challenges...\n\n## Why Verify?\nLand fraud remains a significant concern in Kenya...\n\n## The Process\n1. Engage a reputable verification service\n2. Conduct a search at the Ministry of Lands\n3. Physical inspection of the property\n4. Verify with the local administration\n\n## Documents Required\n- Copy of ID/Passport\n- Title deed or allotment letter\n- Sale agreement\n- Search certificate\n\n## Cost\nBasic verification starts from KES 15,000 depending on location...",
      author: "Admin",
      published: true,
      publishedAt: new Date("2026-05-15"),
    },
  })
  await prisma.blogPost.upsert({
    where: { id: "seed-blog-2" },
    update: {},
    create: {
      id: "seed-blog-2",
      title: "Top 5 Services Every Kenyan in the Diaspora Needs",
      slug: "top-5-services-kenyan-diaspora",
      excerpt: "From property monitoring to family support, here are the essential services for Kenyans abroad.",
      content: "# Top 5 Services\n\n## 1. Construction Monitoring\nKeep track of your building project through regular photo/video updates...\n\n## 2. Vehicle Inspection\nBefore buying that used car for your family back home...\n\n## 3. Land Verification\nEnsure your investment is secure with professional land searches...\n\n## 4. Family Support\nRegular check-ins on elderly parents or school visits...\n\n## 5. Fraud Prevention\nBackground checks on business partners and property agents...",
      author: "Admin",
      published: true,
      publishedAt: new Date("2026-04-20"),
    },
  })
  console.log("  ✓ 2 blog posts")

  await prisma.testimonial.upsert({
    where: { id: "seed-testimonial-1" },
    update: {},
    create: {
      id: "seed-testimonial-1",
      name: "Sarah Wambui",
      role: "Nurse in London",
      content: "DiasporaLink made it possible for me to verify my parents' land title while I'm thousands of miles away. Professional and trustworthy!",
      rating: 5,
      featured: true,
    },
  })
  await prisma.testimonial.upsert({
    where: { id: "seed-testimonial-2" },
    update: {},
    create: {
      id: "seed-testimonial-2",
      name: "Peter Kamau",
      role: "Software Engineer in Berlin",
      content: "The construction monitoring service gave me peace of mind. I received weekly updates with photos of my house being built.",
      rating: 5,
      featured: true,
    },
  })
  await prisma.testimonial.upsert({
    where: { id: "seed-testimonial-3" },
    update: {},
    create: {
      id: "seed-testimonial-3",
      name: "Grace Akinyi",
      role: "Teacher in Dubai",
      content: "Quick response times and very helpful staff. They helped me facilitate important documents for my son's school enrollment.",
      rating: 4,
      featured: false,
    },
  })
  console.log("  ✓ 3 testimonials")

  console.log("\nSeed complete! 🎉")
  console.log("  Admin: admin@diaspora.com / Admin123!")
  console.log("  Staff: staff@diaspora.com / Admin123!")
  console.log("  Client: client@example.com / Client123!")
}

main()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
