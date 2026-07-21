"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { format, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Ticket, UsersRound, BookOpen, DollarSign } from "lucide-react"
import Link from "next/link"
import { TRIP_TYPE_LABELS, PAYMENT_METHOD_LABELS } from "@/data/tickets.data"
import { Button } from "@/components/ui/button"

type Stats = {
  totalReservations: number
  totalUsers: number
  totalArticles: number
  publishedArticles: number
  totalRevenue: number
  recentReservations: {
    id: string
    tripType: string
    amountPaid: string
    status: string
    createdAt: string
    user: { name: string; email: string } | null
    payment: { method: string } | null
  }[]
}

const AdminDashboard = () => {
  const { user, status } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated" && user?.role !== "admin") {
      router.push("/")
      return
    }
    if (status === "authenticated" && user?.role === "admin") {
      fetchStats()
    }
  }, [status, user, router])

  const fetchStats = async () => {
    try {
      const [reservationsRes, usersRes, blogsRes] = await Promise.all([
        fetch("/api/reservations?admin=true"),
        fetch("/api/admin/users"),
        fetch("/api/admin/blogs"),
      ])

      const reservationsData = await reservationsRes.json()
      const usersData = await usersRes.json()
      const blogsData = await blogsRes.json()

      const reservations = reservationsData.reservations || []
      const users = usersData.users || []
      const blogs = blogsData.blogs || []

      const totalRevenue = reservations.reduce(
        (sum: number, r: { amountPaid: string }) => sum + parseFloat(r.amountPaid || "0"),
        0
      )

      setStats({
        totalReservations: reservations.length,
        totalUsers: users.length,
        totalArticles: blogs.length,
        publishedArticles: blogs.filter((b: { published: boolean }) => b.published).length,
        totalRevenue,
        recentReservations: reservations.slice(0, 5),
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold mb-2">Panel de inicio</h1>
      <p className="text-muted-foreground mb-8">
        Bienvenido, {user?.name || "admin"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Link href="/admin/reservations">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer space-y-15">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
              <Ticket className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats?.totalReservations ?? 0}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer space-y-15">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
              <UsersRound className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats?.totalUsers ?? 0}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/blogs">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer space-y-15">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Artículos</CardTitle>
              <BookOpen className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <p className="text-4xl font-bold">{stats?.totalArticles ?? 0}</p>
              <p className="text-xs text-muted-foreground mb-1">
                {stats?.publishedArticles ?? 0} published / {(stats?.totalArticles ?? 0) - (stats?.publishedArticles ?? 0)} drafts
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card className="space-y-15">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              ${(stats?.totalRevenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Reservas Recientes</h2>
          <Link
            href="/admin/reservations"
          >
            <Button>
              Ver todos
            </Button>
          </Link>
        </div>

        {stats?.recentReservations.length === 0 ? (
          <p className="text-muted-foreground">No reservations yet.</p>
        ) : (
          <div className="space-y-3">
            {stats?.recentReservations.map((r) => (
              <Card key={r.id}>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <code className="text-xs font-mono text-muted-foreground">{r.id}</code>
                      <Badge variant={r.status === "confirmed" ? "default" : "destructive"}>
                        {r.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {r.user ? r.user.name : "Invitado"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-5 text-sm text-muted-foreground w-70">
                      <span>{r.payment ? PAYMENT_METHOD_LABELS[r.payment.method as keyof typeof PAYMENT_METHOD_LABELS] : "-"}</span>
                      <span className="font-medium text-foreground">
                        ${parseFloat(r.amountPaid).toFixed(2)}
                      </span>
                      <span>{format(parseISO(r.createdAt), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
