"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  role: string
}

type AuthContextType = {
  user: User | null
  status: "loading" | "authenticated" | "unauthenticated"
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
  refetch: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")
  const router = useRouter()

  const refetch = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me")
      const data = await res.json()
      if (data.user) {
        setUser(data.user)
        setStatus("authenticated")
      } else {
        setUser(null)
        setStatus("unauthenticated")
      }
    } catch {
      setUser(null)
      setStatus("unauthenticated")
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { error: data.error || "Login failed" }
      setUser(data.user)
      setStatus("authenticated")
      return {}
    } catch {
      return { error: "Network error" }
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { error: data.error || "Registration failed" }
      setUser(data.user)
      setStatus("authenticated")
      return {}
    } catch {
      return { error: "Network error" }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {
      // ignore
    }
    setUser(null)
    setStatus("unauthenticated")
    router.push("/")
  }, [router])

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout, refetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
