import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui"

const posts = [
  { slug: "verify-land-ownership-kenya-abroad", title: "How to Verify Land Ownership in Kenya from Abroad", excerpt: "A step-by-step guide for diaspora Kenyans.", date: "2024-01-15", category: "Land Verification" },
  { slug: "red-flags-buying-property-kenya", title: "5 Red Flags When Buying Property in Kenya", excerpt: "Watch out for these common property scams.", date: "2024-01-10", category: "Fraud Prevention" },
]

export const metadata: Metadata = { title: "Blog" }

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground">Educational content for the diaspora community.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <span className="text-xs font-medium text-primary">{post.category}</span>
                <h2 className="font-semibold mt-2 mb-2">{post.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
