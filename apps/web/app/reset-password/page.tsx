"use client"

import { useState, Suspense } from "react"
import { Input, Button, Card, CardContent } from "@/components/ui"
import { apiFetch } from "@/lib/api"
import { Lock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function ResetForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password !== confirm) return setError("Passwords do not match")
    if (password.length < 8) return setError("Password must be at least 8 characters")
    setLoading(true)
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      })
      setDone(true)
    } catch (err: any) {
      setError(err.message || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Password Reset!</h1>
          <p className="text-muted-foreground text-sm mb-6">Your password has been reset successfully.</p>
          <Link href="/login"><Button>Sign In Now</Button></Link>
        </CardContent>
      </Card>
    )
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <Lock className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Invalid Link</h1>
          <p className="text-muted-foreground text-sm mb-6">This password reset link is invalid or expired.</p>
          <Link href="/forgot-password"><Button variant="outline">Request New Link</Button></Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10"><Lock className="h-5 w-5 text-primary" /></div>
          <div><h1 className="text-xl font-bold">Reset Password</h1><p className="text-sm text-muted-foreground">Choose a new password for your account.</p></div>
        </div>
        {error && <p className="text-sm text-destructive mb-4 bg-destructive/5 rounded-lg p-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="password" label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" required />
          <Input id="confirm" label="Confirm Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" required />
          <Button type="submit" loading={loading} className="w-full">Reset Password</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <ResetForm />
      </Suspense>
    </div>
  )
}
