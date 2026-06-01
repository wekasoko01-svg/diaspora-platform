"use client"

import { useEffect } from "react"
import { Card, CardContent, EmptyState, Skeleton, Badge } from "@/components/ui"
import { CreditCard } from "lucide-react"
import { useFetch } from "@/lib/hooks"

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  method: string | null
  user?: { fullName: string; email: string }
  createdAt: string
}

export default function AdminPaymentsPage() {
  const { data: payments, loading, error, fetch } = useFetch<Payment[]>()

  useEffect(() => { fetch("/admin/payments") }, [fetch])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      {loading && <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>}
      {error && <Card className="border-destructive/30 bg-destructive/5 mb-4"><CardContent className="p-4 text-sm text-destructive">{error}</CardContent></Card>}
      {!loading && !error && (!payments || payments.length === 0) && <EmptyState icon={CreditCard} title="No payments" />}
      {payments && payments.length > 0 && (
        <div className="space-y-3">
          {payments.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{p.currency} {Number(p.amount).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{p.user ? `${p.user.fullName} · ${p.user.email}` : "—"} {p.method ? `· ${p.method}` : ""}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={p.status === "PAID" ? "success" : p.status === "FAILED" ? "destructive" : "warning"}>{p.status}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
