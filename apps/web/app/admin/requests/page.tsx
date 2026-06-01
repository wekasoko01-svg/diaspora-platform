"use client"

import { useEffect } from "react"
import { Card, CardContent, EmptyState, Skeleton, Badge } from "@/components/ui"
import { FileText } from "lucide-react"
import { useFetch } from "@/lib/hooks"

interface ServiceRequest {
  id: string
  title: string
  user?: { fullName: string; email: string }
  status: string
  priority: string
  createdAt: string
}

export default function AdminRequestsPage() {
  const { data: requests, loading, error, fetch } = useFetch<ServiceRequest[]>()

  useEffect(() => { fetch("/admin/requests") }, [fetch])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Service Requests</h1>
      {loading && <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>}
      {error && <Card className="border-destructive/30 bg-destructive/5 mb-4"><CardContent className="p-4 text-sm text-destructive">{error}</CardContent></Card>}
      {!loading && !error && (!requests || requests.length === 0) && <EmptyState icon={FileText} title="No requests" />}
      {requests && requests.length > 0 && (
        <div className="space-y-3">
          {requests.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{r.title}</p>
                  <p className="text-sm text-muted-foreground">{r.user ? `${r.user.fullName} · ${r.user.email}` : "—"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={r.priority === "URGENT" ? "destructive" : r.priority === "HIGH" ? "warning" : "default"}>{r.priority}</Badge>
                  <Badge>{r.status}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
