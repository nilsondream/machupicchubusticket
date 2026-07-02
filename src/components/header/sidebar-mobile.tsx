"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"

interface SidebarMobileProps {
  openMenuMobile: boolean;
}

const SidebarMobile = ({ openMenuMobile }: SidebarMobileProps) => {

  return (
    <aside className={cn("hidden invisible max-md:block max-md:visible h-screen bg-background w-full fixed right-0 top-0 p-5 z-40 transform transition-transform duration-300 ease-in-out", openMenuMobile ? "translate-x-0" : "translate-x-full")}>
      <div className="mt-20 space-y-10">
        <div>
          <p className="text-muted-foreground mb-5">Company</p>
          <div className="flex flex-col gap-2">
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SidebarMobile
