"use client"

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import SidebarMobile from "./sidebar-mobile";
import Link from "next/link";
import Settings from "./settings";

const Header = () => {
  const pathname = usePathname();
  const isActive = (path: string): boolean => path === pathname;
  const [color, setColor] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

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
