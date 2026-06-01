import type { Metadata } from "next"
import Link from "next/link"
import { Button, Card, CardContent } from "@/components/ui"

const steps = [
  { title: "Book a Consultation", description: "Fill out our simple booking form with your details and service needs. We'll respond within 24 hours to schedule a free consultation call.", details: "Choose your preferred time, tell us about your needs, and we'll handle the rest." },
  { title: "Discovery & Scope", description: "During your consultation, we'll discuss your requirements in detail and define the scope of work.", details: "We explain our process, timeline, pricing, and answer all your questions." },
  { title: "Confirmation & Payment", description: "Once you're satisfied, we'll send a formal proposal with deliverables, timeline, and pricing.", details: "A 50% deposit secures your slot, and we begin work immediately." },
  { title: "Execution", description: "Our team carries out the work with regular updates and transparent communication.", details: "You receive photos, videos, and progress reports at every stage." },
  { title: "Reporting", description: "Upon completion, you receive a comprehensive report with evidence and recommendations.", details: "All reports include photos, official documents, and actionable insights." },
  { title: "Closeout", description: "We review the results together and ensure everything meets your expectations.", details: "Final payment is due upon delivery, and we remain available for follow-up." },
]

export const metadata: Metadata = { title: "How It Works" }

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How It Works</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          From booking to delivery, here&apos;s how we make it easy for you.
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        {steps.map((step, i) => (
          <div key={step.title} className="flex gap-6 pb-12 relative last:pb-0">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                {i + 1}
              </div>
              {i < steps.length - 1 && <div className="w-0.5 flex-1 bg-primary/20 mt-2" />}
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground mb-2">{step.description}</p>
              <p className="text-sm text-muted-foreground/70">{step.details}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link href="/book"><Button size="lg">Get Started Today</Button></Link>
      </div>
    </div>
  )
}
