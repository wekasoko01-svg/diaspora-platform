"use client"

import { useState } from "react"
import { Button, Input, Card, CardContent, Textarea } from "@/components/ui"
import { Toast } from "@/components/ui/toast"
import { contactSchema } from "@/lib/validations"
import { apiFetch } from "@/lib/api"
import { Phone, Mail, MessageCircle, Clock } from "lucide-react"
import type { ApiResponse } from "@diaspora/shared"

const contactChannels = [
  { icon: Phone, title: "Phone", detail: "+254 700 000 000" },
  { icon: Mail, title: "Email", detail: "hello@diasporalink.com" },
  { icon: MessageCircle, title: "WhatsApp", detail: "+254 700 000 000" },
  { icon: Clock, title: "Support Hours", detail: "Mon-Fri 8AM-6PM EAT | Sat 9AM-2PM EAT" },
]

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    const form = new FormData(e.currentTarget)
    const data = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      phone: form.get("phone") as string,
      message: form.get("message") as string,
    }
    const parsed = contactSchema.safeParse(data)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0] as string] = err.message })
      setErrors(fieldErrors)
      return
    }
    setLoading(true)
    try {
      await apiFetch<ApiResponse>("/contact", { method: "POST", body: JSON.stringify(parsed.data) }).catch(() => { throw new Error("Service temporarily unavailable. Please email us directly.") })
      setToast({ message: "Message sent! We'll respond within 24 hours.", type: "success" })
      e.currentTarget.reset()
    } catch (err: any) {
      setToast({ message: err.message || "Failed to send message", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Have a question or ready to get started? Reach out to us.
          </p>
          <div className="space-y-6">
            {contactChannels.map((channel) => (
              <div key={channel.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <channel.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{channel.title}</h3>
                  <p className="text-sm text-muted-foreground">{channel.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input label="Full Name" id="name" name="name" placeholder="Your name" required error={errors.name} />
              <Input label="Email" id="email" name="email" type="email" placeholder="your@email.com" required error={errors.email} />
              <Input label="Phone" id="phone" name="phone" type="tel" placeholder="+254 700 000 000" />
              <Textarea label="Message" id="message" name="message" placeholder="How can we help?" rows={4} required error={errors.message} />
              <Button className="w-full" loading={loading}>Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
