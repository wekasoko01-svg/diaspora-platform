"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, EmptyState, Button, Skeleton } from "@/components/ui"
import { Toast } from "@/components/ui/toast"
import { FolderOpen, Upload } from "lucide-react"
import { useFetch } from "@/lib/hooks"
import { apiFetch } from "@/lib/api"
import type { ApiResponse } from "@diaspora/shared"

interface Document {
  id: string
  name: string
  type: string
  url: string
  createdAt: string
}

export default function DocumentsPage() {
  const { data: documents, loading, error, fetch } = useFetch<Document[]>()
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  useEffect(() => { fetch("/documents") }, [fetch])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      await apiFetch<ApiResponse>("/documents/upload", { method: "POST", body: formData, headers: {} })
      setToast({ message: "Document uploaded successfully", type: "success" })
      fetch("/documents")
    } catch (err: any) {
      setToast({ message: err.message || "Upload failed", type: "error" })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Documents</h1>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.jpg,.png,.doc,.docx" />
          {uploading ? <Button size="sm" loading={true}>Uploading...</Button> : <Button size="sm"><Upload className="h-4 w-4 mr-2" />Upload Document</Button>}
        </label>
      </div>
      {loading && <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>}
      {error && <Card className="border-destructive/30 bg-destructive/5 mb-4"><CardContent className="p-4 text-sm text-destructive">{error}</CardContent></Card>}
      {!loading && !error && (!documents || documents.length === 0) && (
        <EmptyState icon={FolderOpen} title="No documents uploaded" description="Upload documents for verifications or services." />
      )}
      {documents && documents.length > 0 && (
        <div className="space-y-4">
          {documents.map((d) => (
            <Card key={d.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.type} &middot; {new Date(d.createdAt).toLocaleDateString()}</p>
                </div>
                <a href={d.url} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm">View</Button></a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
