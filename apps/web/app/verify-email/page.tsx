"use client"

import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, Spinner } from "@/components/ui"
import { apiFetch } from "@/lib/api"
import { CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("No verification token provided")
      return
    }
    apiFetch<{ success: boolean; message: string }>(`/auth/verify-email?token=${token}`)
      .then((r) => { setStatus("success"); setMessage(r.message || "Email verified successfully!") })
      .catch((err) => { setStatus("error"); setMessage(err.message || "Verification failed") })
  }, [token])

  return (
    <Card className="w-full max-w-md text-center">
      <CardContent className="p-8">
        {status === "loading" && (
          <div className="py-8"><Spinner size="lg" className="mx-auto mb-4" /><p className="text-muted-foreground">Verifying your email...</p></div>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Email Verified!</h1>
            <p className="text-muted-foreground text-sm mb-6">{message}</p>
            <Link href="/login" className="text-primary hover:underline text-sm">Sign In Now</Link>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Verification Failed</h1>
            <p className="text-muted-foreground text-sm mb-6">{message}</p>
            <Link href="/login" className="text-primary hover:underline text-sm">Back to Sign In</Link>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <VerifyContent />
      </Suspense>
    </div>
  )
}
