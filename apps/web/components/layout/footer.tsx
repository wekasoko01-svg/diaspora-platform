"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { i18n, type Locale } from "@/lib/i18n"

export function Footer() {
  const [, setTick] = useState(0)

  useEffect(() => {
    const unsub = i18n.subscribe(() => setTick((n) => n + 1))
    return unsub
  }, [])

  const t = (path: string) => i18n.t(path)

  const footerLinks = {
    [t("footer.services")]: [
      { href: "/services", label: t("services.landVerification") },
      { href: "/services", label: t("services.constructionMonitoring") },
      { href: "/services", label: t("services.vehicleInspection") },
      { href: "/services", label: t("services.relocationSupport") },
    ],
    [t("footer.company")]: [
      { href: "/about", label: t("footer.about") },
      { href: "/how-it-works", label: t("nav.howItWorks") },
      { href: "/blog", label: t("footer.blog") },
      { href: "/faq", label: t("footer.faq") },
    ],
    [t("footer.support")]: [
      { href: "/contact", label: t("footer.contact") },
      { href: "/privacy", label: t("footer.privacy") },
      { href: "/terms", label: t("footer.terms") },
    ],
  }

  return (
    <footer className="border-t bg-navy-950 text-white" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="sm:col-span-2 md:col-span-1">
            <span className="text-xl font-bold text-primary">Diaspora<span className="text-white">Link</span></span>
            <p className="mt-3 text-sm text-gray-400 max-w-xs leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <h3 className="text-sm font-semibold mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
          <span>&copy; {new Date().getFullYear()} DiasporaLink. {t("common.allRightsReserved")}</span>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="hover:text-white transition-colors">{t("footer.privacy")}</Link>
            <span className="text-gray-700">·</span>
            <Link href="/terms" className="hover:text-white transition-colors">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
