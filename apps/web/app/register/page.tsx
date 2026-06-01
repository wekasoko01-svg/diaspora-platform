"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button, Input, Card, CardContent } from "@/components/ui"
import { Toast } from "@/components/ui/toast"
import { registerSchema } from "@/lib/validations"
import { apiFetch } from "@/lib/api"
import type { ApiResponse, AuthPayload } from "@diaspora/shared"

export default function RegisterPage() {
  const router = useRouter()
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
      country: form.get("country") as string,
      password: form.get("password") as string,
    }
    const parsed = registerSchema.safeParse(data)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0] as string] = err.message })
      setErrors(fieldErrors)
      return
    }
    setLoading(true)
    try {
      const res = await apiFetch<ApiResponse<AuthPayload>>("/auth/register", {
        method: "POST",
        body: JSON.stringify(parsed.data),
      })
      if (res.success) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err: any) {
      setToast({ message: err.message || "Registration failed", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-2 text-center">Get Started</h1>
            <p className="text-sm text-muted-foreground text-center mb-6">Create your DiasporaLink account</p>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input label="Full Name" id="fullName" name="fullName" placeholder="John Doe" autoComplete="name" required error={errors.fullName} />
              <Input label="Email" id="email" name="email" type="email" placeholder="your@email.com" autoComplete="email" required error={errors.email} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Phone" id="phone" name="phone" type="tel" placeholder="+254 700 000 000" autoComplete="tel" error={errors.phone} />
                <Input label="Country" id="country" name="country" placeholder="Kenya" autoComplete="country-name" />
              </div>
              <Input label="Password" id="password" name="password" type="password" placeholder="Min. 8 characters" autoComplete="new-password" hint="At least 8 characters with a number" required error={errors.password} />
              <Button className="w-full" size="lg" loading={loading}>Create Account</Button>
            </form>
            <p className="text-sm text-center text-muted-foreground mt-6">
              Already have an account? <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
