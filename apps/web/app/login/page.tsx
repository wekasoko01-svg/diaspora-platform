"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button, Input, Card, CardContent } from "@/components/ui"
import { Toast } from "@/components/ui/toast"
import { loginSchema } from "@/lib/validations"
import { apiFetch } from "@/lib/api"
import type { ApiResponse, AuthPayload } from "@diaspora/shared"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    const form = new FormData(e.currentTarget)
    const data = { email: form.get("email") as string, password: form.get("password") as string }
    const parsed = loginSchema.safeParse(data)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0] as string] = err.message })
      setErrors(fieldErrors)
      return
    }
    setLoading(true)
    try {
      const res = await apiFetch<ApiResponse<AuthPayload>>("/auth/login", {
        method: "POST",
        body: JSON.stringify(parsed.data),
      })
      if (res.success) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err: any) {
      setToast({ message: err.message || "Invalid email or password", type: "error" })
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
            <h1 className="text-2xl font-bold mb-2 text-center">Welcome Back</h1>
            <p className="text-sm text-muted-foreground text-center mb-6">Sign in to access your dashboard</p>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input label="Email" id="email" name="email" type="email" placeholder="your@email.com" autoComplete="email" required error={errors.email} />
              <Input label="Password" id="password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" required error={errors.password} />
              <div className="flex justify-end -mt-2">
                <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary transition-colors">Forgot password?</Link>
              </div>
              <Button className="w-full" size="lg" loading={loading}>Sign In</Button>
            </form>
            <p className="text-sm text-center text-muted-foreground mt-6">
              Don&apos;t have an account? <Link href="/register" className="text-primary font-medium hover:underline">Create one</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
