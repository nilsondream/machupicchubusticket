import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Idiomas soportados.
  locales: ["en", "es"],
  // Inglés es el idioma por defecto (sin prefijo en la URL).
  defaultLocale: "en",
  // "as-needed": el idioma por defecto va en "/" y los demás con prefijo ("/es").
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/register": {
      en: "/register",
      es: "/registrarse"
    },
    "/about": {
      en: "/about",
      es: "/sobre-nosotros"
    },
    "/reservation": {
      en: "/reservation",
      es: "/reservar"
    },
    "/privacy": {
      en: "/privacy",
      es: "/privacidad"
    },
    "/blog": {
      en: "/blog",
      es: "/articulos"
    },
    "/blog/[slug]": {
      en: "/blog/[slug]",
      es: "/articulos/[slug]"
    },
    "/admin": {
      en: "/admin",
      es: "/admin"
    },
    "/admin/users": {
      en: "/admin/users",
      es: "/admin/users"
    },
    "/admin/products": {
      en: "/admin/products",
      es: "/admin/products"
    },
    "/admin/blogs": {
      en: "/admin/blogs",
      es: "/admin/blogs"
    },
    "/admin/blogs/new": {
      en: "/admin/blogs/new",
      es: "/admin/blogs/new"
    },
    "/admin/blogs/[id]": {
      en: "/admin/blogs/[id]",
      es: "/admin/blogs/[id]"
    },
    "/admin/languages": {
      en: "/admin/languages",
      es: "/admin/languages"
    },
    "/admin/currencies": {
      en: "/admin/currencies",
      es: "/admin/currencies"
    }
  }
});

export type Locale = (typeof routing.locales)[number];
