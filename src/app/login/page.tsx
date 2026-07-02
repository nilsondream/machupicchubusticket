"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/providers/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const tempErrors: { email?: string; password?: string } = {}
    if (!email) {
      tempErrors.email = "El correo electrónico es requerido"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Correo electrónico no válido"
    }
    if (!password) {
      tempErrors.password = "La contraseña es requerida"
    } else if (password.length < 6) {
      tempErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      await login(email, password)
    } catch (err) {
      // El error ya es manejado y mostrado como un toast en AuthProvider
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4 py-16 bg-linear-to-br from-background via-muted/30 to-background overflow-hidden">
      {/* Decorative gradient glowing spheres */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md border-border/40 bg-background/60 backdrop-blur-xl shadow-2xl relative z-10 transition-all duration-300 hover:shadow-primary/5">
        <CardHeader className="space-y-2 text-center pt-8">
          <CardTitle className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-foreground bg-clip-text text-transparent">
            ¡Bienvenido de nuevo!
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 px-6 pb-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="pl-9 pr-4 py-5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-10 py-5"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-destructive mt-1">{errors.password}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 px-6 pb-8">
            <Button
              type="submit"
              className="w-full py-5 text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando Sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
            <div className="text-center text-sm text-muted-foreground pt-2">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline hover:text-primary/95 transition-colors">
                Regístrate aquí
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
