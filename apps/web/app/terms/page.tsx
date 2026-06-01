import type { Metadata } from "next"

export const metadata: Metadata = { title: "Terms of Service" }

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-gray max-w-none space-y-4">
        <p>Last updated: January 2024</p>
        <h2 className="text-xl font-semibold mt-6">Services</h2>
        <p>We provide verification, monitoring, and support services as described in our service agreements.</p>
        <h2 className="text-xl font-semibold mt-6">Payment</h2>
        <p>Payments are due as outlined in each service agreement. Deposits are non-refundable after work commences.</p>
        <h2 className="text-xl font-semibold mt-6">Limitation of Liability</h2>
        <p>Our liability is limited to the value of the service provided. We are not liable for consequential damages.</p>
        <h2 className="text-xl font-semibold mt-6">Contact</h2>
        <p>For questions about these terms, contact us at legal@diasporalink.com.</p>
      </div>
    </div>
  )
}
