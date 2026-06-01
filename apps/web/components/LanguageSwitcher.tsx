"use client"

import { useEffect, useState } from "react"
import { i18n, type Locale } from "@/lib/i18n"
import { Languages } from "lucide-react"

export function LanguageSwitcher({ className }: { className?: string }) {
  const [locale, setLocale] = useState<Locale>(i18n.getLocale())

  useEffect(() => {
    const unsub = i18n.subscribe(() => setLocale(i18n.getLocale()))
    return () => unsub()
  }, [])

  const toggle = () => {
    i18n.setLocale(locale === "en" ? "sw" : "en")
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${className ?? "text-muted-foreground"}`}
      aria-label={`Switch to ${locale === "en" ? "Swahili" : "English"}`}
    >
      <Languages className="h-4 w-4" />
      {locale === "en" ? "SW" : "EN"}
    </button>
  )
}
