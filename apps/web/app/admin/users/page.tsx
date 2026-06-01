"use client"

import { useEffect } from "react"
import { Card, CardContent, EmptyState, Skeleton, Badge } from "@/components/ui"
import { Users } from "lucide-react"
import { useFetch } from "@/lib/hooks"

interface User {
  id: string
  fullName: string
  email: string
  role: string
  country: string | null
  createdAt: string
}

export default function AdminUsersPage() {
  const { data: users, loading, error, fetch } = useFetch<User[]>()

  useEffect(() => { fetch("/admin/users") }, [fetch])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      {loading && <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>}
      {error && <Card className="border-destructive/30 bg-destructive/5 mb-4"><CardContent className="p-4 text-sm text-destructive">{error}</CardContent></Card>}
      {!loading && !error && (!users || users.length === 0) && <EmptyState icon={Users} title="No users registered" />}
      {users && users.length > 0 && (
        <div className="space-y-3">
          {users.map((u) => (
            <Card key={u.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{u.fullName}</p>
                  <p className="text-sm text-muted-foreground">{u.email} {u.country && `· ${u.country}`}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={u.role === "ADMIN" ? "default" : "outline"}>{u.role}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
