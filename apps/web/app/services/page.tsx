import type { Metadata } from "next"
import Link from "next/link"
import { Button, Card, CardContent, Badge } from "@/components/ui"
import { CheckCircle, Clock, FileText, Home, Search, Truck } from "lucide-react"

const servicesList = [
  {
    icon: Search,
    name: "Land Verification",
    category: "Verification",
    risk: "High" as const,
    description: "Verify land ownership, title deed authenticity, and property boundaries through official land registry searches and physical inspections.",
    deliverables: "Title search report, physical inspection report, photos, recommendations",
    price: "From $150",
    turnaround: "3-5 business days",
  },
  {
    icon: Home,
    name: "Construction Monitoring",
    category: "Monitoring",
    risk: "Medium" as const,
    description: "Regular on-site inspections with photo and video evidence to ensure your construction project stays on track.",
    deliverables: "Weekly reports, photo/video evidence, progress tracker, issue alerts",
    price: "From $200/month",
    turnaround: "Ongoing",
  },
  {
    icon: Truck,
    name: "Vehicle Inspection",
    category: "Verification",
    risk: "Medium" as const,
    description: "Comprehensive vehicle inspections including mechanical check, accident history, and document verification.",
    deliverables: "Inspection report, photos, mechanical assessment, valuation estimate",
    price: "From $100",
    turnaround: "1-2 business days",
  },
  {
    icon: FileText,
    name: "Document Facilitation",
    category: "Support",
    risk: "Medium" as const,
    description: "Assistance with obtaining and verifying Kenyan documents including certificates, permits, and legal papers.",
    deliverables: "Document checklist, application support, status tracking",
    price: "From $80",
    turnaround: "Varies by document",
  },
  {
    icon: Clock,
    name: "Relocation Support",
    category: "Support",
    risk: "Low" as const,
    description: "End-to-end support for diaspora Kenyans relocating back home, including property search and setup assistance.",
    deliverables: "Property shortlist, inspection reports, utility setup, school search",
    price: "From $300",
    turnaround: "2-4 weeks",
  },
  {
    icon: CheckCircle,
    name: "Family Support",
    category: "Support",
    risk: "Low" as const,
    description: "Reliable support for family visits, medical appointment accompaniment, school check-ins, and elderly care monitoring.",
    deliverables: "Visit reports, photo updates, emergency contact, regular check-ins",
    price: "From $50/visit",
    turnaround: "Scheduled visits",
  },
]

const riskBadge = { High: "destructive" as const, Medium: "warning" as const, Low: "success" as const }

export const metadata: Metadata = { title: "Services" }

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-16 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Professional verification, monitoring, and support services designed for the diaspora community.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesList.map((service) => (
          <Card key={service.name} className="flex flex-col">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <service.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="default">{service.category}</Badge>
                <Badge variant={riskBadge[service.risk]}>{service.risk} Risk</Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{service.description}</p>
              <div className="space-y-2 text-sm border-t pt-4">
                <p><span className="font-medium">Deliverables:</span> {service.deliverables}</p>
                <p><span className="font-medium">Starting at:</span> {service.price}</p>
                <p><span className="font-medium">Turnaround:</span> {service.turnaround}</p>
              </div>
              <Link href="/book" className="mt-4 block"><Button className="w-full">Book Now</Button></Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
