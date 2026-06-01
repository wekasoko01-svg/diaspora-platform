import type { Metadata } from "next"
import Link from "next/link"
import { Button, Card, CardContent, Badge } from "@/components/ui"

const packages = [
  {
    name: "Single Service",
    price: "Varies",
    description: "Pay per service, no commitment.",
    features: ["One-time verification", "Standard reporting", "Email support", "7-day report access"],
  },
  {
    name: "Retainer",
    price: "From $200/mo",
    description: "Best for ongoing monitoring needs.",
    features: ["Priority scheduling", "Monthly reports", "Discounted rates", "WhatsApp support", "Dedicated coordinator"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations and bulk requests.",
    features: ["Bulk pricing", "Dedicated team", "Custom reporting", "API access", "Monthly invoicing"],
  },
]

const guidelines = [
  { title: "Consultation Fee", detail: "Free initial consultation to discuss your needs." },
  { title: "Deposit", detail: "50% deposit required to start any service." },
  { title: "Milestone Payments", detail: "Balance due upon milestone completion." },
  { title: "Accepted Methods", detail: "M-Pesa, bank transfer, or card payments." },
]

export const metadata: Metadata = { title: "Pricing" }

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Transparent Pricing</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Clear, upfront pricing with no hidden fees. Pay per service or save with a retainer.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
        {packages.map((pkg) => (
          <Card key={pkg.name} className={`flex flex-col relative ${pkg.popular ? "border-primary shadow-elevated ring-1 ring-primary" : ""}`}>
            {pkg.popular && <Badge variant="default" className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
            <CardContent className="p-6 flex flex-col h-full">
              <h3 className="text-xl font-bold">{pkg.name}</h3>
              <p className="text-3xl font-bold mt-3">{pkg.price}</p>
              <p className="text-sm text-muted-foreground mt-1 mb-6">{pkg.description}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="text-sm flex items-center gap-2">
                    <span className="text-primary font-bold" aria-hidden="true">&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/book"><Button variant={pkg.popular ? "primary" : "outline"} className="w-full">Get Started</Button></Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Payment Guidelines</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {guidelines.map((g) => (
                <div key={g.title}>
                  <h3 className="font-semibold mb-1">{g.title}</h3>
                  <p className="text-sm text-muted-foreground">{g.detail}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
