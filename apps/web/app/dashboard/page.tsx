"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, EmptyState, Skeleton, Badge } from "@/components/ui"
import { FileText, Calendar, CreditCard, FolderOpen, Bell, ArrowRight } from "lucide-react"
import { useFetch } from "@/lib/hooks"

interface DashboardStats {
  bookings: number
  requests: number
  payments: number
  documents: number
  recentBookings: { id: string; serviceType: string; status: string; createdAt: string }[]
  upcomingScheduled: { id: string; serviceType: string; scheduledAt: string }[]
}

export default function DashboardPage() {
  const { data: stats, loading, error, fetch } = useFetch<DashboardStats>()

  useEffect(() => { fetch("/bookings?stats=true") }, [fetch])

  const statCards = [
    { icon: FileText, label: "Active Requests", value: stats?.requests ?? 0, color: "text-blue-600", href: "/dashboard/requests" },
    { icon: Calendar, label: "Bookings", value: stats?.bookings ?? 0, color: "text-green-600", href: "/dashboard/bookings" },
    { icon: CreditCard, label: "Payments", value: stats?.payments ?? 0, color: "text-amber-600", href: "/dashboard/payments" },
    { icon: FolderOpen, label: "Documents", value: stats?.documents ?? 0, color: "text-purple-600", href: "/dashboard/documents" },
  ]

  const statusColor: Record<string, "default" | "success" | "warning" | "destructive" | "outline"> = {
    NEW: "warning", SCHEDULED: "default", COMPLETED: "success", CANCELLED: "destructive",
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back</p>
        </div>
        <Badge variant="outline" className="w-fit">Client Account</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="cursor-pointer hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  {loading ? <Skeleton className="h-6 w-12 mb-1" /> : <p className="text-xl font-bold">{stat.value}</p>}
                  <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 text-sm text-destructive flex items-center gap-2">
            <span className="font-medium">Connection error</span> — please try again later
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><h2 className="font-semibold text-sm">Upcoming Scheduled</h2></CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
            ) : stats?.upcomingScheduled?.length ? (
              <div className="space-y-2">
                {stats.upcomingScheduled.slice(0, 3).map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <span className="text-sm font-medium">{b.serviceType.replace(/_/g, " ")}</span>
                    <span className="text-xs text-muted-foreground">{b.scheduledAt ? new Date(b.scheduledAt).toLocaleDateString() : "TBD"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Nothing scheduled" description="Book a service to see it here." />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><h2 className="font-semibold text-sm">Quick Actions</h2></CardHeader>
          <CardContent className="space-y-2">
            <Link href="/book" className="group flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium">Book Consultation</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link href="/dashboard/notifications" className="group flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-medium">Notification Settings</span></div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link href="/dashboard/documents" className="group flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium">Upload Document</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
