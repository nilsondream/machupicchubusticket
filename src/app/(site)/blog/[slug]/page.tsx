import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, User } from "lucide-react"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ slug: string }>
}

async function getBlog(slug: string) {
  try {
    return await prisma.blog.findUnique({
      where: { slug, published: true },
    })
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) return {}

  const title = blog.seoTitle || blog.title
  const description = blog.seoDescription || blog.excerpt || ""

  return {
    title,
    description,
    keywords: blog.seoKeywords || undefined,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: blog.createdAt.toISOString(),
      ...(blog.coverImage && {
        images: [{ url: blog.coverImage, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

const BlogPostPage = async ({ params }: Props) => {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <article>
        <div className="h-120 mt-18 w-full relative grid place-items-center">
          <div className="absolute z-10 grid place-items-center w-full">
            <div className="w-6xl mx-auto mt-10 text-white">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm transition-colors mb-8 hover:text-orange-500"
              >
                <ArrowLeft className="size-4" />
                Back to blog
              </Link>


              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                {blog.title}
              </h1>

              {blog.excerpt && (
                <p className="text-lg leading-relaxed">
                  {blog.excerpt}
                </p>
              )}
            </div>
          </div>

          <div className="w-full h-full bg-black/50 absolute z-5"></div>

          {blog.coverImage && (
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto pb-20 pt-10 space-y-10">
          <div className="flex items-center gap-10 text-sm mt-4 text-muted-foreground">
            {blog.author && (
              <div className="flex items-center gap-2">
                Written by:
                <span>{blog.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              Last Updated:
              {blog.createdAt && (
                <time dateTime={blog.createdAt.toISOString()}>
                  {format(parseISO(blog.createdAt.toISOString()), "MMMM dd, yyyy")}
                </time>
              )}
            </div>
          </div>
          <div
            className="max-w-none [&_a]:text-orange-500 [&_a]:hover:underline [&_li]:list-disc [&_ul]:ml-5 [&_p]:mb-5 [&_h2]:text-2xl [&_h2]:mt-10 [&_p]:last:mb-0"
            dangerouslySetInnerHTML={{ __html: blog.content || "" }}
          />
        </div>
      </article>
    </main>
  )
}

export default BlogPostPage
