import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui"

export const metadata: Metadata = { title: "Blog Post" }

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="text-sm text-primary hover:underline mb-4 inline-block">&larr; Back to Blog</Link>
        <article>
          <h1 className="text-3xl font-bold mb-4">Blog Post: {params.slug.replace(/-/g, " ")}</h1>
          <p className="text-muted-foreground mb-8">Content coming soon. Check back for updates.</p>
        </article>
      </div>
    </div>
  )
}
