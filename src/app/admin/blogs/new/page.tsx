"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, Upload, X } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"
import TiptapEditor from "@/components/editor/tiptap-editor"

const AdminBlogNewPage = () => {
  const { user, status } = useAuth()
  const router = useRouter()
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
  }, [status, user, router])

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
      toast.success("Cover image uploaded")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error uploading image")
    } finally {
      setUploadingCover(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

      toast.success("Article created")
      router.push("/admin/blogs")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error creating article")
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2">
      <div className="p-10">
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Volver a los artículos
        </Link>

        <h1 className="text-3xl font-semibold mb-8">Nuevo artículo</h1>

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
            <Label htmlFor="published" className="mb-0">Published</Label>
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

          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
            Create article
          </Button>
        </form>
      </div>
      <div className="p-10 border-l">
        <p className="text-sm text-muted-foreground">preview</p>
      </div>
    </div>
  )
}

export default AdminBlogNewPage
