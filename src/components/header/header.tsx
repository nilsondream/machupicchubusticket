"use client"

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut, LayoutDashboard, Ticket } from "lucide-react";
import SidebarMobile from "./sidebar-mobile";
import Link from "next/link";
import Settings from "./settings";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback } from "../ui/avatar";

const Header = () => {
  const pathname = usePathname();
  const { user, status, logout } = useAuth();
  const isActive = (path: string): boolean => path === pathname;
  const [scroll, setScroll] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    const changeColor = () => { if (window.scrollY >= 100) { setScroll(true) } else { setScroll(false) } }
    if (typeof window !== "undefined") { window.addEventListener("scroll", changeColor); }
    return () => { if (typeof window !== "undefined") { window.removeEventListener("scroll", changeColor); } };
  }, []);

  const [openMenuMobile, setOpenMenuMobile] = useState(false);
  const openMenu = () => setOpenMenuMobile(!openMenuMobile);


  return (
    <>
      <header className={cn("fixed top-0 left-0 w-full z-50", (isActive("/") || isActive("/es")) ? (scroll || openMenuMobile) ? "bg-background text-foreground border-b" : "text-white border-b border-transparent" : "bg-background text-foreground border-b")}>
        <div className="max-w-6xl mx-auto h-18 flex items-center max-md:px-5 justify-between">
          <div className="flex items-center gap-18">
            <Link href={"/"} className="w-fit flex items-center gap-5 font-semibold text-2xl max-md:text-lg">
              machupicchubusticket.com
            </Link>
          </div>
          <div className="flex justify-end items-center gap-3 max-md:hidden">
            <Button variant="ghost">
              <Link href={"/reservation/ticket"}>Search ticket</Link>
            </Button>
            <Button variant="ghost">
              <Link href={"/blog"}>Blog</Link>
            </Button>
            <Settings />

            {status === "authenticated" && user ? (
              <div className="relative">
                <button
                  onClick={() => setOpenProfile(!openProfile)}
                >
                  <Button variant={scroll ? "outline" : "hero-outline"} size={"icon"} className="rounded-full">
                      {user.name?.charAt(0).toUpperCase() || "?"}
                  </Button>
                </button>

                {openProfile && (
                  <div className="absolute right-0 top-10 z-50 w-56 p-1.5 border shadow-lg rounded-2xl bg-popover text-popover-foreground animate-in fade-in-50 slide-in-from-top-1">
                    <div className="px-3 py-2 border-b mb-1">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/my-reservations"
                      onClick={() => setOpenProfile(false)}
                      className="flex items-center justify-between gap-2 w-full px-3 py-2 text-sm rounded-xl hover:bg-muted transition-all"
                    >
                      My Reservations
                      <Ticket className="size-4" />
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin/reservations"
                        onClick={() => setOpenProfile(false)}
                        className="flex items-center justify-between gap-2 w-full px-3 py-2 text-sm rounded-xl hover:bg-muted transition-all"
                      >
                        Admin Panel
                        <LayoutDashboard className="size-4" />
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={() => { setOpenProfile(false); logout() }}
                      className="cursor-pointer flex items-center justify-between gap-2 w-full px-3 py-2 text-sm rounded-xl hover:bg-destructive/10 text-destructive transition-all"
                    >
                      Sign Out
                      <LogOut className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button variant={scroll ? "outline" : "hero-outline"}>
                <Link href={"/login"}>Sign in</Link>
              </Button>
            )}
          </div>
          <button className="hidden max-md:block" onClick={openMenu}>
            {openMenuMobile ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <SidebarMobile openMenuMobile={openMenuMobile} />
      {openProfile && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenProfile(false)} />
      )}
    </>
  )
}

export default Header
