"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { LayoutDashboard, Users, Calendar, FileText, ShieldCheck, CreditCard, FileEdit, Settings, Bell, LogOut } from "lucide-react"
import { apiFetch } from "@/lib/api"
import type { ApiResponse, AuthPayload } from "@diaspora/shared"

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/requests", label: "Requests", icon: FileText },
  { href: "/admin/verifications", label: "Verifications", icon: ShieldCheck },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/content", label: "Content", icon: FileEdit },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<AuthPayload | null>(null)

  useEffect(() => {
    apiFetch<ApiResponse<AuthPayload>>("/auth/me")
      .then((r) => { if (r.data) setUser(r.data) })
      .catch(() => router.push("/login"))
  }, [router])

  const handleLogout = async () => {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => {})
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="hidden md:flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground shrink-0">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/10">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
            {user?.role?.[0] ?? "A"}
          </div>
          <div>
            <p className="text-sm font-medium">Admin Panel</p>
            <p className="text-xs text-white/60 capitalize">{user?.role?.toLowerCase() ?? "loading..."}</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1" aria-label="Admin navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors w-full">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </div>
    </div>
  )
}
