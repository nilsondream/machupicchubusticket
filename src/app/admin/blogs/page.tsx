"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Pencil, Trash2, Search } from "lucide-react"
import { toast } from "sonner"

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published: boolean
  author: string | null
  coverImage: string | null
  createdAt: string
  updatedAt: string
}

const AdminBlogsPage = () => {
  const { user, status } = useAuth()
  const router = useRouter()
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")

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
      fetchBlogs()
    }
  }, [status, user, router])

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blogs")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setBlogs(data.blogs)
    } catch {
      toast.error("Error loading blogs")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success("Blog deleted")
      fetchBlogs()
    } catch {
      toast.error("Error deleting blog")
    }
  }

  const filteredBlogs = useMemo(() => {
    let result = blogs

    if (statusFilter === "published") {
      result = result.filter((b) => b.published)
    } else if (statusFilter === "draft") {
      result = result.filter((b) => !b.published)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.slug.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q)
      )
    }

    return result
  }, [blogs, search, statusFilter])

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Artículos</h1>
        <Link href="/admin/blogs/new">
          <Button>
            <Plus className="size-4 mr-2" />
            Nuevo artículo
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative max-w-sm flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, slug, author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          {["", "published", "draft"].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="lg"
              onClick={() => setStatusFilter(s)}
            >
              {s ? (s === "published" ? "Published" : "Drafts") : "All"}
            </Button>
          ))}
        </div>

        <div className="text-sm px-3 py-1 bg-muted rounded-lg h-10 grid place-items-center">
          {filteredBlogs.length} article{filteredBlogs.length !== 1 ? "s" : ""}
          {blogs.length !== filteredBlogs.length && ` / ${blogs.length} total`}
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <p className="text-muted-foreground">
          {search || statusFilter ? "No articles match your filters." : "No hay artículos todavía."}
        </p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left py-3 px-4 font-medium w-100">Title</th>
                <th className="text-left py-3 px-4 font-medium w-100">Slug</th>
                <th className="text-left py-3 px-4 font-medium">Author</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Updated</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="border-b last:border-0 hover:bg-muted/30 w-100">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium line-clamp-1">{blog.title}</p>
                      {/*blog.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {blog.excerpt}
                        </p>
                      )*/}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground w-100">
                    <p className="line-clamp-1">
                      /{blog.slug}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    {blog.author || <span className="text-muted-foreground">-</span>}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={blog.published ? "default" : "secondary"}>
                      {blog.published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">
                    {format(parseISO(blog.updatedAt), "MMM dd, yyyy")}
                  </td>
                  <td className="py-3 px-4 w-20">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/blogs/${blog.id}`}>
                        <Button variant="outline" size="sm">
                          <Pencil />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                         className="text-destructive"
                        onClick={() => handleDelete(blog.id, blog.title)}
                      >
                        <Trash2 />
                        Eliminar
                      </Button>
                    </div>
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

export default AdminBlogsPage
