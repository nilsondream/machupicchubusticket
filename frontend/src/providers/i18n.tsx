"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react"
import { useLocale } from "next-intl"

import { api, Currency, Language } from "@/lib/api"

interface I18nContextType {
  language: string
  currency: Currency | null
  languages: Language[]
  currencies: Currency[]
  ready: boolean
  setCurrency: (code: string) => void
  /** Traduce una clave del backend; devuelve la clave si no existe traducción. */
  t: (key: string, fallback?: string) => string
  /** Formatea un precio (en moneda base USD) a la moneda seleccionada. */
  formatPrice: (amountUsd: number) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 año

const setCookie = (name: string, value: string) => {
  if (typeof document === "undefined") return
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

const readCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null
  return document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1] ?? null
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // El idioma es la fuente de verdad de next-intl (derivado de la URL).
  const language = useLocale()

  const [currencyCode, setCurrencyCode] = useState<string>("USD")
  const [languages, setLanguages] = useState<Language[]>([])
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [ready, setReady] = useState(false)

  // Carga inicial: catálogos + traducciones del idioma actual.
  useEffect(() => {
    let active = true
    const initialCurrency = readCookie("currency") ?? undefined

    api
      .bootstrap(language, initialCurrency)
      .then((data) => {
        if (!active) return
        setLanguages(data.languages)
        setCurrencies(data.currencies)
        setTranslations(data.translations)
        setCurrencyCode(initialCurrency ?? data.currency)
        setCookie("currency", initialCurrency ?? data.currency)
      })
      .catch((err) => console.error("Error cargando i18n:", err))
      .finally(() => active && setReady(true))

    return () => {
      active = false
    }
    // Solo en el montaje inicial.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Al cambiar el idioma (URL), refresca las traducciones del backend.
  useEffect(() => {
    let active = true
    if (!ready) return

    api
      .translations(language)
      .then((data) => active && setTranslations(data.translations))
      .catch((err) => console.error("Error cargando traducciones:", err))

    return () => {
      active = false
    }
  }, [language, ready])

  const setCurrency = useCallback((code: string) => {
    setCurrencyCode(code)
    setCookie("currency", code)
  }, [])

  const currency = useMemo(
    () => currencies.find((c) => c.code === currencyCode) ?? null,
    [currencies, currencyCode]
  )

  const t = useCallback(
    (key: string, fallback?: string) => translations[key] ?? fallback ?? key,
    [translations]
  )

  const formatPrice = useCallback(
    (amountUsd: number) => {
      if (!currency) return `$${amountUsd.toFixed(2)}`
      const converted = amountUsd * currency.exchangeRate
      return `${currency.symbol}${converted.toFixed(currency.decimalDigits)}`
    },
    [currency]
  )

  const value: I18nContextType = {
    language,
    currency,
    languages,
    currencies,
    ready,
    setCurrency,
    t,
    formatPrice,
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
