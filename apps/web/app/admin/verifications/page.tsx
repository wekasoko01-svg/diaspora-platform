"use client"

import { useEffect } from "react"
import { Card, CardContent, EmptyState, Skeleton, Badge } from "@/components/ui"
import { ShieldCheck } from "lucide-react"
import { useFetch } from "@/lib/hooks"

interface Verification {
  id: string
  location: string
  result: string | null
  conductedAt: string | null
  createdAt: string
  request?: { title: string }
}

export default function AdminVerificationsPage() {
  const { data: verifications, loading, error, fetch } = useFetch<Verification[]>()

  useEffect(() => { fetch("/admin/verifications") }, [fetch])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Verifications</h1>
      {loading && <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>}
      {error && <Card className="border-destructive/30 bg-destructive/5 mb-4"><CardContent className="p-4 text-sm text-destructive">{error}</CardContent></Card>}
      {!loading && !error && (!verifications || verifications.length === 0) && <EmptyState icon={ShieldCheck} title="No verifications" />}
      {verifications && verifications.length > 0 && (
        <div className="space-y-3">
          {verifications.map((v) => (
            <Card key={v.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{v.request?.title ?? "Verification"}</p>
                  <p className="text-sm text-muted-foreground">{v.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  {v.result && <Badge variant={v.result === "PASS" ? "success" : "destructive"}>{v.result}</Badge>}
                  <span className="text-xs text-muted-foreground">{v.conductedAt ? new Date(v.conductedAt).toLocaleDateString() : "Pending"}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
