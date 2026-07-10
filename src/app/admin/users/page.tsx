"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { format, parseISO } from "date-fns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"

type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  _count: { reservations: number }
}

const AdminUsersPage = () => {
  const { user: currentUser, status } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated" && currentUser?.role !== "admin") {
      router.push("/")
      return
    }
    if (status === "authenticated" && currentUser?.role === "admin") {
      fetchUsers()
    }
  }, [status, currentUser, router])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setUsers(data.users)
    } catch {
      toast.error("Error loading users")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This will also delete their reservations.`)) return

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete")
      }

      toast.success("User deleted")
      fetchUsers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error deleting user")
    }
  }

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users
    const q = search.toLowerCase()
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    )
  }, [users, search])

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold mb-8">Usuarios</h1>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-muted-foreground">
          {search ? "No users match your search." : "No users yet."}
        </p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-4 font-medium">Email</th>
                <th className="text-left py-3 px-4 font-medium">Role</th>
                <th className="text-center py-3 px-4 font-medium">Reservations</th>
                <th className="text-left py-3 px-4 font-medium">Joined</th>
                <th className="text-center py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="py-3 px-4">{u.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                  <td className="py-3 px-4">
                    <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">{u._count.reservations}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {format(parseISO(u.createdAt), "MMM dd, yyyy")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(u.id, u.name)}
                      disabled={u.id === currentUser?.id}
                      title={u.id === currentUser?.id ? "Cannot delete yourself" : "Delete user"}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminUsersPage
