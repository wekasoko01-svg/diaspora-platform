import type { Metadata } from "next"
import { EmptyState } from "@/components/ui"
import { FileEdit } from "lucide-react"

export const metadata: Metadata = { title: "Content Management" }

export default function AdminContentPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Content Management</h1>
      <EmptyState
        icon={FileEdit}
        title="Coming soon"
        description="The content management panel is being built. You'll be able to manage blog posts, testimonials, and pages here."
      />
    </div>
  )
}
