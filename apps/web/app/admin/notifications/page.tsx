"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, Button, Input, Textarea, Badge, Skeleton, EmptyState } from "@/components/ui"
import { apiFetch } from "@/lib/api"
import { Bell, Send, CheckCircle } from "lucide-react"

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    apiFetch<{ success: boolean; data: any[] }>("/admin/notifications")
      .then((r) => { if (r.data) setNotifications(r.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setSent(false)
    try {
      await apiFetch("/admin/notifications/broadcast", {
        method: "POST",
        body: JSON.stringify({ subject, body }),
      })
      setSent(true)
      setSubject("")
      setBody("")
      setTimeout(() => setSent(false), 4000)
    } catch {} finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notification Management</h1>
        <p className="text-muted-foreground mt-1">Broadcast emails and view recent notifications</p>
      </div>

      <Card>
        <CardContent className="p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"><Send className="h-4 w-4" /> Broadcast Email</h2>
          <form onSubmit={handleBroadcast} className="space-y-4">
            <Input id="subject" label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="e.g., New Service Announcement" />
            <Textarea id="body" label="Email Body (HTML)" value={body} onChange={(e) => setBody(e.target.value)} required placeholder="<h2>Hello!</h2><p>Your message here...</p>" className="min-h-[120px]" />
            <div className="flex items-center gap-3">
              <Button type="submit" loading={sending}><Send className="h-4 w-4 mr-2" /> Send to All Users</Button>
              {sent && <span className="text-sm text-success flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Broadcast sent!</span>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"><Bell className="h-4 w-4" /> Recent Notifications</h2>
          {loading ? (
            <div className="space-y-2"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></div>
          ) : notifications.length === 0 ? (
            <EmptyState title="No notifications yet" />
          ) : (
            <div className="space-y-2">
              {notifications.map((n: any) => (
                <div key={n.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <Badge variant="outline" className="shrink-0 text-[10px]">{n.action.replace(/_/g, " ")}</Badge>
                    <span className="text-muted-foreground truncate">{n.user?.fullName || "System"}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
