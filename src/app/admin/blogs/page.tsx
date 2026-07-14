"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Pencil, Trash2, Search, Upload, X, Eye } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@/components/ui/dialog"
import Image from "next/image"

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
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
  const [createOpen, setCreateOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "",
    published: false,
  })

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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }))
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingCover(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Upload failed")
      }

      const data = await res.json()
      setForm((prev) => ({ ...prev, coverImage: data.url }))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error uploading image")
    } finally {
      setUploadingCover(false)
    }
  }

  const openCreate = () => {
    setForm({ title: "", slug: "", excerpt: "", content: "", coverImage: "", author: "", published: false })
    setCreateOpen(true)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.slug) {
      toast.error("Title and slug are required")
      return
    }
    setSaving(true)

    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create")
      }

      const data = await res.json()
      toast.success("Article created")
      setCreateOpen(false)
      router.push(`/admin/blogs/${data.blog.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error creating article")
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = (blog: BlogPost) => {
    sessionStorage.setItem(
      "blog_preview",
      JSON.stringify({
        title: blog.title,
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        coverImage: blog.coverImage || "",
        author: blog.author || "",
        published: blog.published,
      })
    )
    window.open("/admin/blogs/preview", "_blank")
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
        <Button onClick={openCreate}>
          <Plus className="size-4 mr-2" />
          Nuevo artículo
        </Button>
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
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground w-100">
                    <p className="line-clamp-1">/{blog.slug}</p>
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
                  <td className="py-3 px-4 w-30">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/blogs/${blog.id}`}>
                        <Button variant="outline" size="sm">
                          <Pencil />
                          Editar
                        </Button>
                      </Link>
                      <Button variant="outline" size="icon-sm" onClick={() => handlePreview(blog)}>
                        <Eye />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        className="text-destructive"
                        onClick={() => handleDelete(blog.id, blog.title)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <form onSubmit={handleCreate}>
          <DialogHeader>
            <h2 className="text-xl font-semibold">Nuevo artículo</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Crea rápidamente un artículo. Luego podrás editarlo con más detalle.
            </p>
          </DialogHeader>

          <DialogBody>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modal-title">Título *</Label>
                <Input
                  id="modal-title"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Título del artículo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modal-slug">Slug *</Label>
                <Input
                  id="modal-slug"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="article-slug"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modal-author">Autor</Label>
                  <Input
                    id="modal-author"
                    value={form.author}
                    onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                    placeholder="Nombre del autor"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Imagen destacada</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      disabled={uploadingCover}
                      onClick={() => document.getElementById("modal-cover-upload")?.click()}
                    >
                      {uploadingCover ? (
                        <Loader2 className="size-4 mr-1 animate-spin" />
                      ) : (
                        <Upload className="size-4 mr-1" />
                      )}
                      Subir
                    </Button>
                    <input
                      id="modal-cover-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverUpload}
                    />
                    {form.coverImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-lg"
                        onClick={() => setForm((prev) => ({ ...prev, coverImage: "" }))}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                  {form.coverImage && (
                    <div className="relative aspect-2/1 rounded-lg overflow-hidden border mt-2">
                      <Image
                        src={form.coverImage}
                        alt="Cover"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modal-excerpt">Extracto</Label>
                <Textarea
                  id="modal-excerpt"
                  value={form.excerpt}
                  onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Descripción breve"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="modal-published"
                  checked={form.published}
                  onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.checked }))}
                  className="size-4"
                />
                <Label htmlFor="modal-published" className="mb-0">Publicado</Label>
              </div>
            </div>
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
              Crear artículo
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  )
}

export default AdminBlogsPage
