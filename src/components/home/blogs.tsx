import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { format, parseISO } from "date-fns"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const Blogs = async () => {
  let blogs: {
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    createdAt: Date
  }[] = []

  try {
    blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        createdAt: true,
      },
    })
  } catch {
    return null
  }

  if (blogs.length === 0) return null

  return (
    <section className="border-y py-24 bg-background">
      <div className="max-w-6xl mx-auto space-y-12 max-md:px-5">
        <div className="flex items-end justify-center">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Latest from our blog
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Travel tips, guides, and updates about visiting Machu Picchu.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog.slug}
              href={`/blog/${blog.slug}`}
              className="group block"
            >
              <article className="border rounded-2xl overflow-hidden transition-shadow h-full">
                {blog.coverImage && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    {format(parseISO(blog.createdAt.toISOString()), "MMM dd, yyyy")}
                  </p>
                  <h3 className="font-semibold group-hover:text-orange-500 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  {blog.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {blog.excerpt}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="text-center">
            <Link
            href="/blog"
            >
            <Button>
            View all articles
            <ArrowRight />
          </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Blogs
