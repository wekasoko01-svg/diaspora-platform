"use client"

import { useState } from "react"
import { Button, Input, Card, CardContent, Textarea, Select } from "@/components/ui"
import { Toast } from "@/components/ui/toast"
import { bookingSchema } from "@/lib/validations"
import { apiFetch } from "@/lib/api"
import type { ApiResponse } from "@diaspora/shared"

const serviceOptions = [
  { value: "", label: "Select a service" },
  { value: "LAND_VERIFICATION", label: "Land Verification" },
  { value: "CONSTRUCTION_MONITORING", label: "Construction Monitoring" },
  { value: "VEHICLE_INSPECTION", label: "Vehicle Inspection" },
  { value: "RELOCATION_SUPPORT", label: "Relocation Support" },
  { value: "FAMILY_SUPPORT", label: "Family Support" },
  { value: "FRAUD_PREVENTION", label: "Fraud Prevention" },
  { value: "DOCUMENT_FACILITATION", label: "Document Facilitation" },
  { value: "CONSULTATION", label: "General Consultation" },
]

const priorityOptions = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
]

export default function BookPage() {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    const form = new FormData(e.currentTarget)
    const data = {
      fullName: form.get("fullName") as string,
      email: form.get("email") as string,
      phone: form.get("phone") as string,
      countryOfResidence: form.get("country") as string,
      serviceType: form.get("serviceType") as string,
      budget: form.get("budget") as string,
      priority: form.get("priority") as string,
      message: form.get("message") as string,
    }
    const parsed = bookingSchema.safeParse(data)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0] as string] = err.message })
      setErrors(fieldErrors)
      return
    }
    setLoading(true)
    try {
      await apiFetch<ApiResponse>("/bookings", { method: "POST", body: JSON.stringify(parsed.data) })
      setToast({ message: "Booking submitted! We'll contact you within 24 hours.", type: "success" })
      e.currentTarget.reset()
    } catch (err: any) {
      setToast({ message: err.message || "Failed to submit booking", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Book a Free Consultation</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Tell us about your needs and we&apos;ll get back to you within 24 hours.
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Full Name" id="fullName" name="fullName" placeholder="John Doe" required error={errors.fullName} />
                <Input label="Email" id="email" name="email" type="email" placeholder="john@email.com" required error={errors.email} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Phone" id="phone" name="phone" type="tel" placeholder="+254 700 000 000" error={errors.phone} />
                <Input label="Country of Residence" id="country" name="country" placeholder="United States" error={errors.countryOfResidence} />
              </div>
              <Select label="Service Type" id="serviceType" name="serviceType" options={serviceOptions} defaultValue="" error={errors.serviceType} />
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Budget Range" id="budget" name="budget" placeholder="$100 - $500" hint="Optional" />
                <Select label="Priority" id="priority" name="priority" options={priorityOptions} defaultValue="MEDIUM" />
              </div>
              <Textarea label="Tell us about your needs" id="message" name="message" placeholder="Describe what you need help with..." rows={4} error={errors.message} />
              <Button className="w-full" size="lg" loading={loading}>Submit Booking Request</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
