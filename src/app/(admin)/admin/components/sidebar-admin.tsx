"use client"

import Icons from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { BookOpen, LayoutGrid, Ticket, UsersRound } from "lucide-react"
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarNavigations = [
  {
    icon: LayoutGrid,
    label: "Panel de inicio",
    path: "/admin"
  },
  {
    icon: Ticket,
    label: "Reservas",
    path: "/admin/reservations"
  },
  {
    icon: UsersRound,
    label: "Usuarios",
    path: "/admin/users"
  },
  {
    icon: BookOpen,
    label: "Artículos",
    path: "/admin/blogs"
  }
]

const SidebarAdmin = () => {
  const pathname = usePathname();
  const isActive = (path: string): boolean => path === pathname;

  return (
    <div className="col-span-1 px-5 py-10 border-r h-screen sticky top-0">
      <Link href="/" className="flex items-center gap-2 font-semibold hover:text-orange-500">
        <Icons.LogoIcon className="w-9 shrink-0" />
        <p className="truncate">machupicchubusticket.com</p>
      </Link>
      <div className="grid grid-cols-1 gap-3 mt-10">
        {sidebarNavigations.map((item, index) => (
          <Link
            href={item.path}
            key={index}
            className={cn("flex items-center gap-3 font-semibold", isActive(item.path) ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SidebarAdmin