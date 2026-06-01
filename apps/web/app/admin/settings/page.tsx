import type { Metadata } from "next"
import { EmptyState } from "@/components/ui"
import { Settings } from "lucide-react"

export const metadata: Metadata = { title: "Settings" }

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <EmptyState
        icon={Settings}
        title="Coming soon"
        description="Platform settings for configuration and customization are being developed."
      />
    </div>
  )
}
