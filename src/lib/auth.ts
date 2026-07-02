import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "machupicchubusticket-jwt-secret-2024"
)

const COOKIE_NAME = "session"

function base64url(input: Uint8Array): string {
  return btoa(String.fromCharCode(...input))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

async function sign(payload: Record<string, unknown>): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)
  const tokenPayload = { ...payload, iat: now, exp: now + 7 * 24 * 60 * 60 }

  const enc = new TextEncoder()
  const headerEncoded = base64url(enc.encode(JSON.stringify(header)))
  const payloadEncoded = base64url(enc.encode(JSON.stringify(tokenPayload)))

  const key = await crypto.subtle.importKey(
    "raw",
    JWT_SECRET.buffer as ArrayBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(`${headerEncoded}.${payloadEncoded}`)
  )

  return `${headerEncoded}.${payloadEncoded}.${base64url(new Uint8Array(signature))}`
}

async function verify(token: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const [headerEncoded, payloadEncoded, signatureEncoded] = parts

    const key = await crypto.subtle.importKey(
      "raw",
      JWT_SECRET.buffer as ArrayBuffer,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    )

    function b64u(encoded: string): ArrayBuffer {
      const s = encoded.replace(/-/g, "+").replace(/_/g, "/")
      const pad = s.length % 4 ? 4 - (s.length % 4) : 0
      return Uint8Array.from(atob(s + "=".repeat(pad)), (c) => c.charCodeAt(0)).buffer as ArrayBuffer
    }

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      b64u(signatureEncoded),
      new TextEncoder().encode(`${headerEncoded}.${payloadEncoded}`)
    )

    if (!isValid) return null

    const decoder = new TextDecoder()
    const payload = JSON.parse(decoder.decode(b64u(payloadEncoded)))

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null

    return payload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(user: { id: string; email: string; role: string }) {
  const token = await sign({ id: user.id, email: user.email, role: user.role })
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  })
  return token
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function auth() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  const payload = await verify(token)
  if (!payload?.id || !payload?.email || !payload?.role) return null

  return {
    user: {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as string,
    },
  }
}

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value ?? null
}
