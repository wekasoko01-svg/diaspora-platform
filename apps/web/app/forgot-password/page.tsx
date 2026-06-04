"use client"

import { useState } from "react"
import { Input, Button, Card, CardContent } from "@/components/ui"
import { apiFetch } from "@/lib/api"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      })
      setSent(true)
    } catch (err: any) {
      setError(err.message || "Failed to send reset email")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Check Your Email</h1>
            <p className="text-muted-foreground text-sm mb-6">
              If an account exists with {email}, we&apos;ve sent password reset instructions.
            </p>
            <Link href="/login" className="text-sm text-primary hover:underline">Back to Sign In</Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <Link href="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Sign In
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10"><Mail className="h-5 w-5 text-primary" /></div>
            <div><h1 className="text-xl font-bold">Forgot Password?</h1><p className="text-sm text-muted-foreground">No worries, we&apos;ll send you reset instructions.</p></div>
          </div>
          {error && <p className="text-sm text-destructive mb-4 bg-destructive/5 rounded-lg p-3">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input id="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            <Button type="submit" loading={loading} className="w-full">Send Reset Instructions</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
