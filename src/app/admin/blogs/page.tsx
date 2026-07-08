"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published: boolean
  author: string | null
  createdAt: string
  updatedAt: string
}

const AdminBlogsPage = () => {
  const { user, status } = useAuth()
  const router = useRouter()
  const [blogs, setBlogs] = useState<BlogPost[]>([])
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

      {blogs.length === 0 ? (
        <p className="text-muted-foreground">No hay artículos todavía.</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <Card key={blog.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{blog.title}</CardTitle>
                    <Badge variant={blog.published ? "default" : "secondary"}>
                      {blog.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/blogs/${blog.id}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="size-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(blog.id, blog.title)}
                    >
                      <Trash2 className="size-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>/{blog.slug}</span>
                  {blog.author && <span>· {blog.author}</span>}
                  <span>· Updated {format(parseISO(blog.updatedAt), "MMM dd, yyyy")}</span>
                </div>
                {blog.excerpt && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-1">{blog.excerpt}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminBlogsPage
