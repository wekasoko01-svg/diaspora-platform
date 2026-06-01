"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, EmptyState, Button, Skeleton, Badge } from "@/components/ui"
import { Calendar, ArrowRight } from "lucide-react"
import { useFetch } from "@/lib/hooks"

interface Booking {
  id: string
  serviceType: string
  status: string
  priority: string
  createdAt: string
  message: string
}

const statusBadge: Record<string, "default" | "warning" | "success" | "destructive" | "outline"> = {
  NEW: "warning", SCHEDULED: "default", IN_PROGRESS: "warning", COMPLETED: "success", CANCELLED: "destructive",
}

export default function BookingsPage() {
  const { data: bookings, loading, error, fetch } = useFetch<Booking[]>()

  useEffect(() => { fetch("/bookings") }, [fetch])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <Link href="/book"><Button size="sm">+ New Booking</Button></Link>
      </div>
      {loading && <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>}
      {error && <Card className="border-destructive/30 bg-destructive/5 mb-4"><CardContent className="p-4 text-sm text-destructive">{error}</CardContent></Card>}
      {!loading && !error && (!bookings || bookings.length === 0) && (
        <EmptyState icon={Calendar} title="No bookings yet" description="Book a consultation to get started." action={<Link href="/book"><Button>Book Consultation</Button></Link>} />
      )}
      {bookings && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{b.serviceType.replace(/_/g, " ")}</h3>
                    <Badge variant={statusBadge[b.status] ?? "outline"}>{b.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{b.message.slice(0, 100)}{b.message.length > 100 ? "..." : ""}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(b.createdAt).toLocaleDateString()}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
