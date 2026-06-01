"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { Button, Spinner, Card, CardContent } from "@/components/ui"
import { Bell, BellOff, Mail, MessageSquare, Smartphone, Globe, Megaphone, CheckCircle } from "lucide-react"

type Prefs = {
  email: boolean
  sms: boolean
  whatsapp: boolean
  push: boolean
  marketing: boolean
}

const channels = [
  { key: "email" as const, label: "notifications.email", icon: Mail },
  { key: "sms" as const, label: "notifications.sms", icon: Smartphone },
  { key: "whatsapp" as const, label: "notifications.whatsapp", icon: MessageSquare },
  { key: "push" as const, label: "notifications.push", icon: Bell },
  { key: "marketing" as const, label: "notifications.marketing", icon: Megaphone },
]

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<Prefs | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    apiFetch<{ success: boolean; data: Prefs }>("/notifications/preferences")
      .then((r) => { if (r.data) setPrefs(r.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggle = async (key: keyof Prefs) => {
    if (!prefs) return
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(next)
    setSaving(true)
    setSaved(false)
    try {
      await apiFetch("/notifications/preferences", {
        method: "PUT",
        body: JSON.stringify(next),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setPrefs(prefs)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notification Preferences</h1>
        <p className="text-muted-foreground mt-1">Choose how you want to receive notifications</p>
      </div>

      <div className="grid gap-4 max-w-xl">
        {channels.map((ch) => {
          const enabled = prefs?.[ch.key] ?? false
          return (
            <Card key={ch.key} className={`transition-colors ${enabled ? "border-primary/30" : "opacity-70"}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      <ch.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {ch.label === "notifications.email" ? "Email Notifications" :
                         ch.label === "notifications.sms" ? "SMS Notifications" :
                         ch.label === "notifications.whatsapp" ? "WhatsApp Notifications" :
                         ch.label === "notifications.push" ? "Push Notifications" : "Marketing Emails"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle(ch.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${enabled ? "bg-primary" : "bg-input"}`}
                    role="switch"
                    aria-checked={enabled}
                  >
                    <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${enabled ? "translate-x-[22px]" : "translate-x-[2px]"}`} />
                  </button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        {saving && <Spinner size="sm" />}
        {saved && (
          <span className="text-sm text-success flex items-center gap-1.5 animate-fade-in">
            <CheckCircle className="h-4 w-4" /> Preferences saved
          </span>
        )}
      </div>
    </div>
  )
}
