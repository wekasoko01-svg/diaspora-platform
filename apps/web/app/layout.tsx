import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { Header, Footer } from "@/components/layout"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: { default: "DiasporaLink | Operations, Relocation & Verification Services", template: "%s | DiasporaLink" },
  description: "Trusted diaspora operations platform for land verification, construction monitoring, vehicle inspection, and relocation support in Kenya.",
  openGraph: { title: "DiasporaLink", description: "Your trusted partner for diaspora operations in Kenya." },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `try { let t = localStorage.getItem("theme"); if (t === "dark" || (!t && window.matchMedia("(prefers-color-scheme:dark)").matches)) document.documentElement.classList.add("dark") } catch(e) {}`
        }} />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1 animate-fade-in">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
