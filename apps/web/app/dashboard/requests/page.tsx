"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, EmptyState, Button, Skeleton, Badge } from "@/components/ui"
import { FileText } from "lucide-react"
import { useFetch } from "@/lib/hooks"

interface ServiceRequest {
  id: string
  title: string
  status: string
  priority: string
  createdAt: string
  description: string
}

const statusBadge: Record<string, "default" | "warning" | "success" | "destructive" | "outline"> = {
  OPEN: "warning", ASSIGNED: "default", IN_PROGRESS: "warning", UNDER_REVIEW: "outline", COMPLETED: "success", CANCELLED: "destructive",
}

export default function RequestsPage() {
  const { data: requests, loading, error, fetch } = useFetch<ServiceRequest[]>()

  useEffect(() => { fetch("/requests") }, [fetch])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Requests</h1>
        <Link href="/book"><Button size="sm">+ New Request</Button></Link>
      </div>
      {loading && <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>}
      {error && <Card className="border-destructive/30 bg-destructive/5 mb-4"><CardContent className="p-4 text-sm text-destructive">{error}</CardContent></Card>}
      {!loading && !error && (!requests || requests.length === 0) && (
        <EmptyState icon={FileText} title="No requests yet" description="Submit a service request to get started." action={<Link href="/book"><Button>Submit Request</Button></Link>} />
      )}
      {requests && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{r.title}</h3>
                  <Badge variant={statusBadge[r.status] ?? "outline"}>{r.status}</Badge>
                  <Badge variant={r.priority === "URGENT" ? "destructive" : r.priority === "HIGH" ? "warning" : "default"}>{r.priority}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{r.description.slice(0, 150)}{r.description.length > 150 ? "..." : ""}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
