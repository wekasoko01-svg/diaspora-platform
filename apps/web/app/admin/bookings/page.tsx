"use client"

import { useEffect } from "react"
import { Card, CardContent, EmptyState, Skeleton, Badge } from "@/components/ui"
import { Calendar } from "lucide-react"
import { useFetch } from "@/lib/hooks"

interface Booking {
  id: string
  user?: { fullName: string; email: string }
  serviceType: string
  status: string
  priority: string
  createdAt: string
}

export default function AdminBookingsPage() {
  const { data: bookings, loading, error, fetch } = useFetch<Booking[]>()

  useEffect(() => { fetch("/admin/bookings") }, [fetch])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Bookings</h1>
      {loading && <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>}
      {error && <Card className="border-destructive/30 bg-destructive/5 mb-4"><CardContent className="p-4 text-sm text-destructive">{error}</CardContent></Card>}
      {!loading && !error && (!bookings || bookings.length === 0) && <EmptyState icon={Calendar} title="No bookings" />}
      {bookings && bookings.length > 0 && (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{b.serviceType.replace(/_/g, " ")}</p>
                  <p className="text-sm text-muted-foreground">{b.user ? `${b.user.fullName} · ${b.user.email}` : "—"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={b.priority === "URGENT" ? "destructive" : "outline"}>{b.priority}</Badge>
                  <Badge>{b.status}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
