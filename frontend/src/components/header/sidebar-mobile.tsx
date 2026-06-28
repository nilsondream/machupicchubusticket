"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAuth } from "@/providers/auth"

interface SidebarMobileProps {
  openMenuMobile: boolean;
}

const SidebarMobile = ({ openMenuMobile }: SidebarMobileProps) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className={cn("hidden invisible max-md:block max-md:visible h-screen bg-background w-full fixed right-0 top-0 p-5 z-40 transform transition-transform duration-300 ease-in-out", openMenuMobile ? "translate-x-0" : "translate-x-full")}>
      <div className="mt-20 space-y-10">
        <div>
          <p className="text-muted-foreground mb-5">Company</p>
          <div className="flex flex-col gap-2">
          </div>
        </div>
        <div>
          <p className="text-muted-foreground mb-5">Cuenta</p>
          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <p className="text-sm font-medium">{user.name || user.email}</p>
                <p className="text-xs text-muted-foreground">
                  Rol: {user.role === "ADMIN" ? "Administrador" : "Usuario"}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-left text-sm text-destructive hover:underline"
                >
                  Cerrar sesion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm hover:underline">
                  Iniciar Sesion
                </Link>
                <Link href="/register" className="text-sm hover:underline">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SidebarMobile
