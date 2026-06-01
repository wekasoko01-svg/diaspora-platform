"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, EmptyState, Button, Skeleton, Badge } from "@/components/ui"
import { CreditCard } from "lucide-react"
import { useFetch } from "@/lib/hooks"

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  method: string | null
  createdAt: string
}

const statusBadge: Record<string, "default" | "warning" | "success" | "destructive" | "outline"> = {
  PENDING: "warning", PAID: "success", PARTIALLY_PAID: "default", REFUNDED: "outline", FAILED: "destructive",
}

export default function PaymentsPage() {
  const { data: payments, loading, error, fetch } = useFetch<Payment[]>()

  useEffect(() => { fetch("/payments") }, [fetch])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      {loading && <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>}
      {error && <Card className="border-destructive/30 bg-destructive/5 mb-4"><CardContent className="p-4 text-sm text-destructive">{error}</CardContent></Card>}
      {!loading && !error && (!payments || payments.length === 0) && (
        <EmptyState icon={CreditCard} title="No payment history" description="Payments will appear here once you book a service." action={<Link href="/book"><Button variant="outline">Book a Service</Button></Link>} />
      )}
      {payments && payments.length > 0 && (
        <div className="space-y-4">
          {payments.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{p.currency} {Number(p.amount).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{p.method ?? "—"} &middot; {new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge variant={statusBadge[p.status] ?? "outline"}>{p.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
