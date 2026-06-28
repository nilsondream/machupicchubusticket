import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Obtener tokens desde las cookies
  const accessToken = request.cookies.get("accessToken")?.value
  const refreshToken = request.cookies.get("refreshToken")?.value
  const hasSession = !!(accessToken || refreshToken)

  // Determinar el tipo de ruta
  //const isProtectedRoute = pathname.startsWith("/reservation")
  const isProtectedRoute = pathname.startsWith("/reservations")
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register")

  if (isProtectedRoute && !hasSession) {
    // Guardamos la URL de retorno para redirigir después del inicio de sesión
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && hasSession) {
    // Redirigir a la raíz si el usuario ya cuenta con una sesión iniciada
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/reservation/:path*", "/login", "/register"],
}
