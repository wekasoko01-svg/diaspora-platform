import * as Sentry from "@sentry/nextjs"

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.config")
  }
}

export async function onRequestError(error: unknown) {
  Sentry.captureException(error)
}
