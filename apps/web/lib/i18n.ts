import en from "../locales/en.json"
import sw from "../locales/sw.json"

const locales = { en, sw } as const
export type Locale = keyof typeof locales

const STORAGE_KEY = "locale"

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en"
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "en" || stored === "sw") return stored
    const browserLang = navigator.language.split("-")[0]
    if (browserLang === "sw") return "sw"
  } catch {}
  return "en"
}

class I18n {
  private locale: Locale = "en"
  private listeners: Set<() => void> = new Set()

  init() {
    this.locale = getInitialLocale()
  }

  getLocale() {
    return this.locale
  }

  setLocale(locale: Locale) {
    this.locale = locale
    if (typeof window !== "undefined") {
      try { localStorage.setItem(STORAGE_KEY, locale) } catch {}
    }
    document.documentElement.lang = locale === "sw" ? "sw" : "en"
    this.listeners.forEach((fn) => fn())
  }

  t(path: string): string {
    const keys = path.split(".")
    let value: any = locales[this.locale]
    for (const key of keys) {
      value = value?.[key]
    }
    return typeof value === "string" ? value : path
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn)
    return () => { this.listeners.delete(fn) }
  }
}

export const i18n = new I18n()
if (typeof window !== "undefined") i18n.init()
