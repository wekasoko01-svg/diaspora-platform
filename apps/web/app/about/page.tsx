import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui"

const teamMembers = [
  { name: "James Mwangi", role: "Founder & CEO", bio: "15+ years in diaspora services and real estate verification." },
  { name: "Sarah Wanjiku", role: "Operations Director", bio: "Expert in logistics and field operations coordination." },
]

export const metadata: Metadata = { title: "About Us" }

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About DiasporaLink</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-muted-foreground mb-6">
            We bridge the distance between diaspora Kenyans and their businesses, properties, and families back home.
          </p>
          <p className="mb-4">
            Founded to solve a simple problem — diaspora Kenyans lacked a trusted partner on the ground. We provide 
            professional verification, monitoring, and support services so you don&apos;t need to be physically present.
          </p>
          <p className="mb-8">
            Our team combines local expertise with professional standards to deliver accurate, timely reports you can rely on.
          </p>
        </div>
        <h2 className="text-2xl font-bold mt-12 mb-6">Our Team</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.name}>
              <CardContent className="p-6">
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
