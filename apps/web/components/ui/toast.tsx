"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, X } from "lucide-react"

export function Toast({ message, type = "info", onClose }: { message: string; type?: "success" | "error" | "info"; onClose: () => void }) {
  React.useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t) }, [onClose])
  const icons = { success: CheckCircle2, error: AlertCircle, info: AlertCircle }
  const Icon = icons[type]
  const colors = { success: "border-success/30 bg-success/5", error: "border-destructive/30 bg-destructive/5", info: "border-primary/30 bg-primary/5" }
  return (
    <div className={cn("fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-elevated animate-slide-in-right", colors[type])} role="alert">
      <Icon className={cn("h-5 w-5", { "text-success": type === "success", "text-destructive": type === "error", "text-primary": type === "info" })} />
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 rounded-md p-1 hover:bg-black/5 transition-colors" aria-label="Dismiss"><X className="h-4 w-4" /></button>
    </div>
  )
}
