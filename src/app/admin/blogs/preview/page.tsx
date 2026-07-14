"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, ArrowLeft } from "lucide-react"
import BlogPreview from "@/components/editor/blog-preview"
import Link from "next/link"

type PreviewData = {
  title: string
  excerpt: string
  content: string
  coverImage: string
  author: string
  published: boolean
}

const AdminBlogPreviewPage = () => {
  const { status } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<PreviewData | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "loading") return

    try {
      const stored = sessionStorage.getItem("blog_preview")
      if (stored) {
        setData(JSON.parse(stored))
      }
    } catch {
      // ignore
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Volver a los artículos
          </Link>
        </div>

        <h1 className="text-2xl font-semibold mb-6">Vista previa del artículo</h1>

        {data ? (
          <BlogPreview
            title={data.title}
            excerpt={data.excerpt}
            content={data.content}
            coverImage={data.coverImage}
            author={data.author}
            published={data.published}
          />
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p>No hay datos de vista previa disponibles.</p>
            <p className="text-sm mt-2">Abre la vista previa desde el editor de un artículo.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBlogPreviewPage
