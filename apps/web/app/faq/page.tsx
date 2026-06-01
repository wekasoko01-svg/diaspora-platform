import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui"

const faqs = [
  { q: "What areas do you serve?", a: "We primarily serve the Kenyan market, with operations in Nairobi, Mombasa, Kisumu, and growing coverage across all 47 counties." },
  { q: "How do I know you're legitimate?", a: "We are registered in Kenya, carry professional liability insurance, and provide verifiable reports from official sources." },
  { q: "How long does a land verification take?", a: "Most verifications are completed within 3-5 business days, depending on location and the specific searches required." },
  { q: "Can I get updates during the process?", a: "Yes. You receive regular updates via email or WhatsApp, including photos and progress reports." },
  { q: "What payment methods do you accept?", a: "We accept M-Pesa, bank transfers, and card payments. Deposits are required before work begins." },
  { q: "Do you offer refunds?", a: "We stand by our work. If we fail to deliver as agreed, we offer a full refund. Partial refunds apply for incomplete work." },
]

export const metadata: Metadata = { title: "FAQ" }

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.q}>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
