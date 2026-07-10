"use client"

import { Calendar, User } from "lucide-react"

type BlogPreviewProps = {
  title: string
  excerpt: string
  content: string
  coverImage: string
  author: string
  published: boolean
}

const BlogPreview = ({ title, excerpt, content, coverImage, author, published }: BlogPreviewProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Vista previa</h2>

      {!title && !content && !coverImage ? (
        <p className="text-sm text-muted-foreground">
          Completa los campos para ver la vista previa...
        </p>
      ) : (
        <article className="rounded-lg border overflow-hidden bg-white">
          {coverImage && (
            <div className="h-48 w-full relative overflow-hidden bg-muted">
              <div className="w-full h-full bg-linear-to-t from-black/50 absolute z-5" />
              <img
                src={coverImage}
                alt={title || ""}
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-4 left-4 z-10 right-4">
                {title && (
                  <h3 className="text-white text-xl font-bold leading-tight">{title}</h3>
                )}
              </div>
            </div>
          )}

          <div className="p-5">
            {!coverImage && title && (
              <h3 className="text-xl font-bold leading-tight mb-3">{title}</h3>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar size={13} />
                <span>Fecha de publicación</span>
              </div>
              {author && (
                <div className="flex items-center gap-1">
                  <User size={13} />
                  <span>{author}</span>
                </div>
              )}
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                  published
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {published ? "Publicado" : "Borrador"}
              </span>
            </div>

            {excerpt && (
              <p className="text-sm text-muted-foreground mb-4 italic">{excerpt}</p>
            )}

            {content ? (
              <div
                className="text-sm [&_a]:text-orange-500 [&_a]:hover:underline [&_li]:list-disc [&_ul]:ml-5 [&_p]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-6 [&_p]:last:mb-0 [&_img]:rounded-md [&_img]:my-3 [&_img]:max-w-full"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="text-sm text-muted-foreground">Sin contenido...</p>
            )}
          </div>
        </article>
      )}
    </div>
  )
}

export default BlogPreview
