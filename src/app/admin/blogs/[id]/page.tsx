"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, Upload, X, Eye } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"
import TiptapEditor from "@/components/editor/tiptap-editor"

type BlogForm = {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  author: string
  published: boolean
  seoTitle: string
  seoDescription: string
  seoKeywords: string
}

const AdminBlogEditPage = () => {
  const { user, status } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [form, setForm] = useState<BlogForm>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "",
    published: false,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
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
      fetchBlog()
    }
  }, [status, user, router])

  const fetchBlog = async () => {
    try {
      const res = await fetch("/api/admin/blogs")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      const blog = data.blogs.find((b: { id: string }) => b.id === id)
      if (!blog) throw new Error("Blog not found")
      setForm({
        title: blog.title || "",
        slug: blog.slug || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        coverImage: blog.coverImage || "",
        author: blog.author || "",
        published: blog.published ?? false,
        seoTitle: blog.seoTitle || "",
        seoDescription: blog.seoDescription || "",
        seoKeywords: blog.seoKeywords || "",
      })
    } catch (err) {
      toast.error("Error loading article")
      router.push("/admin/blogs")
    } finally {
      setLoading(false)
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
      slug: prev.slug || prev.title === "" ? generateSlug(title) : prev.slug,
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
      toast.success("Cover image uploaded")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error uploading image")
    } finally {
      setUploadingCover(false)
    }
  }

  const handlePreview = () => {
    sessionStorage.setItem(
      "blog_preview",
      JSON.stringify({
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        coverImage: form.coverImage,
        author: form.author,
        published: form.published,
      })
    )
    window.open("/admin/blogs/preview", "_blank")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update")
      }

      toast.success("Article updated")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error updating article")
    } finally {
      setSaving(false)
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
    <div className="p-10 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver a los artículos
        </Link>

        <Button type="button" variant="outline" onClick={handlePreview}>
          <Eye className="size-4 mr-2" />
          Vista previa
        </Button>
      </div>

      <h1 className="text-3xl font-semibold mb-8">Editar artículo</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Título del artículo"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            placeholder="article-slug"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="author">Autor</Label>
            <Input
              id="author"
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
                onClick={() => document.getElementById("cover-upload")?.click()}
              >
                {uploadingCover ? (
                  <Loader2 className="size-4 mr-1 animate-spin" />
                ) : (
                  <Upload className="size-4 mr-1" />
                )}
                Subir imagen
              </Button>
              <input
                id="cover-upload"
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
          <Label htmlFor="excerpt">Extracto</Label>
          <Textarea
            id="excerpt"
            value={form.excerpt}
            onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
            placeholder="Descripción breve para los anuncios"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Contenido *</Label>
          <TiptapEditor
            content={form.content}
            onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
            placeholder="Start writing your article..."
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.checked }))}
            className="size-4"
          />
          <Label htmlFor="published" className="mb-0">Publicado</Label>
        </div>

        <hr />

        <h2 className="text-xl font-semibold">SEO Settings</h2>

        <div className="space-y-2">
          <Label htmlFor="seoTitle">SEO title</Label>
          <Input
            id="seoTitle"
            value={form.seoTitle}
            onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
            placeholder="Custom meta title (defaults to article title)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seoDescription">SEO description</Label>
          <Textarea
            id="seoDescription"
            value={form.seoDescription}
            onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
            placeholder="Custom meta description"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seoKeywords">SEO keywords (comma-separated)</Label>
          <Input
            id="seoKeywords"
            value={form.seoKeywords}
            onChange={(e) => setForm((prev) => ({ ...prev, seoKeywords: e.target.value }))}
            placeholder="machu picchu, travel, peru"
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
            Guardar cambios
          </Button>
          <Button type="button" variant="outline" onClick={handlePreview}>
            <Eye className="size-4 mr-2" />
            Vista previa
          </Button>
          <Link href="/admin/blogs">
            <Button variant="outline" type="button">Cancelar</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}

export default AdminBlogEditPage
