import type { Metadata } from "next"

export const metadata: Metadata = { title: "Privacy Policy" }

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-gray max-w-none space-y-4">
        <p>Last updated: January 2024</p>
        <h2 className="text-xl font-semibold mt-6">Information We Collect</h2>
        <p>We collect information you provide directly: name, email, phone number, and service details.</p>
        <h2 className="text-xl font-semibold mt-6">How We Use Your Information</h2>
        <p>We use your information to provide services, communicate with you, and improve our platform.</p>
        <h2 className="text-xl font-semibold mt-6">Data Protection</h2>
        <p>We implement industry-standard security measures to protect your data. We never share your information with third parties without your consent.</p>
        <h2 className="text-xl font-semibold mt-6">Contact</h2>
        <p>For privacy concerns, contact us at privacy@diasporalink.com.</p>
      </div>
    </div>
  )
}
