"use client"

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut, User } from "lucide-react";
import SidebarMobile from "./sidebar-mobile";
import Link from "next/link";
import Settings from "./settings";
import { Button } from "../ui/button";
import { useAuth } from "@/providers/auth";

const Header = () => {
  const pathname = usePathname();
  const isActive = (path: string): boolean => path === pathname;
  const [color, setColor] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const { user, isLoading, logout: handleLogout } = useAuth();

  useEffect(() => {
    const changeColor = () => { if (window.scrollY >= 100) { setColor(true) } else { setColor(false) } }
    if (typeof window !== "undefined") { window.addEventListener("scroll", changeColor); }
    return () => { if (typeof window !== "undefined") { window.removeEventListener("scroll", changeColor); } };
  }, []);

  const [openMenuMobile, setOpenMenuMobile] = useState(false);
  const openMenu = () => setOpenMenuMobile(!openMenuMobile);

  return (
    <>
      <header className={cn("fixed top-0 left-0 w-full z-50", (isActive("/") || isActive("/es")) ? (color || openMenuMobile) ? "bg-background text-foreground border-b" : "text-white border-b border-transparent" : "bg-background text-foreground border-b")}>
        <div className="max-w-6xl mx-auto h-18 flex items-center max-md:px-5 justify-between">
          <div className="flex items-center gap-18">
            <Link href={"/"} className="w-fit flex items-center gap-5 font-semibold text-2xl">
              machupicchubusticket.com
            </Link>
          </div>
          <div className="flex justify-end items-center gap-3 max-md:hidden">
            <Settings />
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => setOpenProfile(!openProfile)} className="cursor-pointer">
                  <User className="h-5 w-5" />
                </Button>
                {openProfile && (
                  <div className="absolute right-0 mt-2 w-56 rounded-3xl border border-border bg-popover p-4 text-popover-foreground shadow-lg z-50 animate-in fade-in-50 slide-in-from-top-1">
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold text-sm truncate">{user.name || user.email}</span>
                      <span className="text-xs text-muted-foreground font-normal truncate">
                        {user.email}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium mt-0.5">
                        Rol: {user.role === "ADMIN" ? "Administrador" : "Usuario"}
                      </span>
                    </div>
                    <hr className="my-2 border-border" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpenProfile(false);
                      }}
                      className="flex items-center w-full text-destructive hover:bg-destructive/10 hover:text-destructive px-2.5 py-2 rounded-md text-sm cursor-pointer transition-colors"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="ghost">Iniciar Sesion</Button>
                </Link>
                <Link href="/register">
                  <Button>Registrarse</Button>
                </Link>
              </div>
            )}
          </div>
          <button className="hidden max-md:block" onClick={openMenu}>
            {openMenuMobile ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <SidebarMobile openMenuMobile={openMenuMobile} />
    </>
  )
}

export default Header
