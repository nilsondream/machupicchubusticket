import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
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
    <main className="min-h-screen max-w-3xl mx-auto px-4 py-24">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="size-4" />
        Back to blog
      </Link>

      <article>
        {blog.coverImage && (
          <div className="relative aspect-[2/1] rounded-2xl overflow-hidden mb-8">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          {blog.createdAt && (
            <time dateTime={blog.createdAt.toISOString()}>
              {format(parseISO(blog.createdAt.toISOString()), "MMMM dd, yyyy")}
            </time>
          )}
          {blog.author && (
            <>
              <span>·</span>
              <span>{blog.author}</span>
            </>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          {blog.title}
        </h1>

        {blog.excerpt && (
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {blog.excerpt}
          </p>
        )}

        <div
          className="prose prose-gray dark:prose-invert max-w-none
            prose-headings:font-bold prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-pre:rounded-xl"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </main>
  )
}

export default BlogPostPage
