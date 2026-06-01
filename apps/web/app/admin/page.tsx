"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, Skeleton } from "@/components/ui"
import { useFetch } from "@/lib/hooks"
import { Chart, registerables } from "chart.js"
import { Users, Calendar, FileText, AlertCircle, DollarSign } from "lucide-react"

Chart.register(...registerables)

interface AdminStats {
  totalUsers: number; totalBookings: number; totalRequests: number
  pendingBookings: number; revenue: number
}
interface Analytics {
  months: string[]
  bookingsByMonth: number[]
  revenueByMonth: number[]
  usersByMonth: number[]
  requestsByMonth: number[]
}

function LineChart({ data, labels, label, color }: { data: number[]; labels: string[]; label: string; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label, data, borderColor: color, backgroundColor: color + "20",
          fill: true, tension: 0.4, pointRadius: 3, pointHoverRadius: 5,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" }, ticks: { font: { size: 11 } } },
        },
      },
    })
    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [data, labels, label, color])

  return <canvas ref={canvasRef} />
}

function BarChart({ data, labels, label, color }: { data: number[]; labels: string[]; label: string; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()
    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label, data, backgroundColor: color + "30", borderColor: color,
          borderWidth: 2, borderRadius: 4,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" }, ticks: { font: { size: 11 } } },
        },
      },
    })
    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [data, labels, label, color])

  return <canvas ref={canvasRef} />
}

export default function AdminOverviewPage() {
  const { data: stats, loading: statsLoading, fetch: fetchStats } = useFetch<AdminStats>()
  const { data: analytics, loading: analyticsLoading, fetch: fetchAnalytics } = useFetch<Analytics>()

  useEffect(() => { fetchStats("/admin/stats"); fetchAnalytics("/admin/analytics") }, [fetchStats, fetchAnalytics])

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers, icon: Users, color: "text-blue-600" },
    { label: "Total Bookings", value: stats?.totalBookings, icon: Calendar, color: "text-green-600" },
    { label: "Pending Bookings", value: stats?.pendingBookings, icon: AlertCircle, color: "text-amber-600" },
    { label: "Total Requests", value: stats?.totalRequests, icon: FileText, color: "text-purple-600" },
    { label: "Revenue (KES)", value: stats?.revenue?.toLocaleString(), icon: DollarSign, color: "text-emerald-600" },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground mt-1">Platform performance and analytics at a glance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              {statsLoading ? <Skeleton className="h-7 w-16 mb-1" /> : <p className={`text-2xl font-bold ${stat.color}`}>{stat.value ?? "—"}</p>}
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-5">
            <h2 className="text-sm font-semibold mb-4">Bookings (6-month trend)</h2>
            <div className="h-48">{analyticsLoading ? <Skeleton className="h-full w-full" /> : analytics && <LineChart data={analytics.bookingsByMonth} labels={analytics.months} label="Bookings" color="#328d6b" />}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h2 className="text-sm font-semibold mb-4">Revenue (KES) — 6-month trend</h2>
            <div className="h-48">{analyticsLoading ? <Skeleton className="h-full w-full" /> : analytics && <LineChart data={analytics.revenueByMonth} labels={analytics.months} label="Revenue" color="#3e6088" />}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h2 className="text-sm font-semibold mb-4">New Users (6-month trend)</h2>
            <div className="h-48">{analyticsLoading ? <Skeleton className="h-full w-full" /> : analytics && <BarChart data={analytics.usersByMonth} labels={analytics.months} label="Users" color="#54a987" />}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h2 className="text-sm font-semibold mb-4">Service Requests (6-month trend)</h2>
            <div className="h-48">{analyticsLoading ? <Skeleton className="h-full w-full" /> : analytics && <BarChart data={analytics.requestsByMonth} labels={analytics.months} label="Requests" color="#86a0bf" />}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
