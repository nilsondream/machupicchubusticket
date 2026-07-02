"use client"

import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { User, Ticket, LayoutDashboard, LogOut } from "lucide-react"

interface SidebarMobileProps {
  openMenuMobile: boolean;
}

const SidebarMobile = ({ openMenuMobile }: SidebarMobileProps) => {
  const { user, status, logout } = useAuth()

  return (
    <aside className={cn("hidden invisible max-md:block max-md:visible h-screen bg-background w-full fixed right-0 top-0 p-5 z-40 transform transition-transform duration-300 ease-in-out", openMenuMobile ? "translate-x-0" : "translate-x-full")}>
      <div className="mt-20 space-y-10">
        <div>
          <p className="text-muted-foreground mb-5">Menu</p>
          <div className="flex flex-col gap-2">
            {status === "authenticated" && user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 text-sm">
                  <User className="size-4" />
                  <span className="truncate">{user.name}</span>
                </div>
                <Link
                  href="/my-reservations"
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-muted transition-all"
                >
                  <Ticket className="size-4" />
                  My Reservations
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin/reservations"
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-muted transition-all"
                  >
                    <LayoutDashboard className="size-4" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-destructive/10 text-destructive transition-all"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-muted transition-all"
              >
                <User className="size-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SidebarMobile
