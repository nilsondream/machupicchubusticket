"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"

import { api, AuthUser, RegisterPayload } from "@/lib/api"

const TOKEN_KEY = "mbt_admin_token"

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  loading: boolean
  loginModalOpen: boolean
  openLogin: () => void
  closeLogin: () => void
  login: (email: string, password: string) => Promise<AuthUser>
  register: (payload: RegisterPayload) => Promise<AuthUser>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  // Al montar: recupera el token persistido y valida la sesión contra /auth/me.
  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null

    if (!stored) {
      setLoading(false)
      return
    }

    let active = true
    api.auth
      .me(stored)
      .then((me) => {
        if (!active) return
        setToken(stored)
        setUser(me)
      })
      .catch(() => {
        if (!active) return
        localStorage.removeItem(TOKEN_KEY)
      })
      .finally(() => active && setLoading(false))

    return () => {
      active = false
    }
  }, [])

  const openLogin = useCallback(() => setLoginModalOpen(true), [])
  const closeLogin = useCallback(() => setLoginModalOpen(false), [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.auth.login(email, password)
    localStorage.setItem(TOKEN_KEY, result.token)
    setToken(result.token)
    setUser(result.user)
    return result.user
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const result = await api.auth.register(payload)
    localStorage.setItem(TOKEN_KEY, result.token)
    setToken(result.token)
    setUser(result.user)
    return result.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginModalOpen,
        openLogin,
        closeLogin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
