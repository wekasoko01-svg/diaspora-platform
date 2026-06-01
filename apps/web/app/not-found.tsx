import Link from "next/link"
import { Button } from "@/components/ui"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center animate-fade-in">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/"><Button>Go Home</Button></Link>
        <Link href="/contact"><Button variant="outline">Contact Support</Button></Link>
      </div>
    </div>
  )
}
