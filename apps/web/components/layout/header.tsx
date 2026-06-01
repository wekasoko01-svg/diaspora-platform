"use client"

import Link from "next/link"
import { Button } from "@/components/ui"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import { i18n } from "@/lib/i18n"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [dark, setDark] = useState(false)
  const [, setTick] = useState(0)

  useEffect(() => { setMounted(true); setDark(document.documentElement.classList.contains("dark")); const u = i18n.subscribe(() => setTick(n => n + 1)); return u }, [])

  const t = (path: string) => i18n.t(path)

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/services", label: t("nav.services") },
    { href: "/pricing", label: t("nav.pricing") },
    { href: "/how-it-works", label: t("nav.howItWorks") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ]

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2" aria-label="DiasporaLink Home">
          <span className="text-xl font-bold text-primary">Diaspora<span className="text-navy-700 dark:text-navy-300">Link</span></span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          {mounted && (
            <button onClick={toggleTheme} className="rounded-lg p-2 hover:bg-muted transition-colors" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          )}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link href="/book"><Button size="sm">Book Consultation</Button></Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden rounded-lg p-2 hover:bg-muted transition-colors" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="md:hidden border-t bg-background animate-fade-in" aria-label="Mobile navigation">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-border" />
            <Link href="/login" onClick={() => setMenuOpen(false)}><Button variant="ghost" size="sm" className="w-full justify-start">Sign In</Button></Link>
            <Link href="/book" onClick={() => setMenuOpen(false)}><Button size="sm" className="w-full">Book Consultation</Button></Link>
          </div>
        </nav>
      )}
    </header>
  )
}
