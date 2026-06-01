import Link from "next/link"
import { Button, Card, CardContent } from "@/components/ui"
import { CheckCircle, Shield, Users, FileSearch } from "lucide-react"

const services = [
  { icon: FileSearch, title: "Land Verification", description: "Verify land ownership, title deeds, and property boundaries remotely." },
  { icon: Shield, title: "Construction Monitoring", description: "Real-time updates and reports on your construction project progress." },
  { icon: Users, title: "Family Support", description: "Reliable support for family visits, medical appointments, and school check-ins." },
  { icon: CheckCircle, title: "Vehicle Inspection", description: "Thorough vehicle inspections before you purchase or ship." },
]

const steps = [
  { number: "01", title: "Book a Consultation", description: "Tell us what you need and we'll schedule a free consultation." },
  { number: "02", title: "Scope & Confirm", description: "We agree on deliverables, timeline, and pricing." },
  { number: "03", title: "We Execute", description: "Our team handles everything with regular updates." },
  { number: "04", title: "Receive Report", description: "Get a comprehensive report with evidence and recommendations." },
]

export default function HomePage() {
  return (
    <>
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-navy-50" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Your Trusted Partner for{" "}
              <span className="text-primary">Diaspora Operations</span> in Kenya
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              From land verification to construction monitoring, we handle everything so you don&apos;t have to be there.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/book"><Button size="lg">Book Free Consultation</Button></Link>
              <Link href="/services"><Button variant="outline" size="lg">Explore Services</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Services</h2>
            <p className="mt-3 text-muted-foreground">Professional verification and support services for the diaspora community</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <Card key={service.title} className="group hover:shadow-card-hover transition-all duration-200" style={{ animationDelay: `${i * 100}ms` }}>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-3 text-muted-foreground">Simple process, real results</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="mx-auto w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">
              Book a free consultation and let us help you with your verification and operations needs in Kenya.
            </p>
            <Link href="/book"><Button size="lg">Book Free Consultation</Button></Link>
          </div>
        </div>
      </section>
    </>
  )
}
