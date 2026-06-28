"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api, AuthUser, RegisterPayload } from "@/lib/api"

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Intenta obtener el usuario actual usando la cookie accessToken
        const res = await api.auth.me()
        setUser(res.user)
      } catch (err) {
        // Si el accessToken expiró o no existe, intenta refrescar el token
        try {
          const refreshRes = await api.auth.refresh()
          setUser(refreshRes.user)
        } catch (refreshErr) {
          // Si el refresh token también expiró, limpiamos el estado del usuario
          setUser(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await api.auth.login(email, password)
      setUser(res.user)
      toast.success("¡Inicio de sesión exitoso!")
      router.push("/")
    } catch (err: any) {
      toast.error(err.message || "Error al iniciar sesión")
      throw err;
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true)
    try {
      const res = await api.auth.register(payload)
      setUser(res.user)
      toast.success("¡Registro de usuario exitoso!")
      router.push("/")
    } catch (err: any) {
      toast.error(err.message || "Error al registrarse")
      throw err;
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await api.auth.logout()
      setUser(null)
      toast.success("Sesión cerrada correctamente")
      router.push("/")
    } catch (err: any) {
      toast.error("Error al cerrar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}
