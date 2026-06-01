"use client"

import * as Sentry from "@sentry/nextjs"
import { Button } from "@/components/ui"
import { AlertCircle } from "lucide-react"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  Sentry.captureException(error)
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center animate-fade-in">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Critical Error</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              A critical error occurred. Our team has been notified.
            </p>
            <Button onClick={reset}>Try Again</Button>
          </div>
        </div>
      </body>
    </html>
  )
}
