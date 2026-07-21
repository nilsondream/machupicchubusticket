import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | Machu Picchu Bus Tickets",
  description: "Discover travel tips, guides, and news about Machu Picchu. Learn about the best times to visit, how to get there, and more.",
  openGraph: {
    title: "Blog | Machu Picchu Bus Tickets",
    description: "Discover travel tips, guides, and news about Machu Picchu.",
  },
}

async function getBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        author: true,
        createdAt: true,
      },
    })
    return blogs
  } catch {
    return []
  }
}

const BlogListingPage = async () => {
  const blogs = await getBlogs()

  return (
    <main className="min-h-screen">
      <div className="h-100 mt-18 relative grid place-items-center">
        <img src="https://images.unsplash.com/photo-1697137031949-5795e4dc476e?q=80&w=1632&auto=format&fit=crop" alt="Blog Background" className="z-0 absolute w-full h-full object-cover" />
        <div className="bg-black opacity-25 absolute z-5 inset-0"></div>
        <div className="flex flex-col items-center gap-5 absolute text-center text-white z-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Machu Picchu Bus Tickets <br />& Travel Guides
          </h1>
          <p className="text-lg w-3/5 hidden">
            Book your official bus to Machu Picchu and discover expert travel guides,
            insider tips, itineraries, and everything you need for a smooth and unforgettable trip.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-20">
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No articles yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                className="group block"
              >
                <article className="border rounded-2xl overflow-hidden transition-shadow">
                  {blog.coverImage && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground mb-2">
                      {blog.createdAt && format(parseISO(blog.createdAt.toISOString()), "MMM dd, yyyy")}
                      {blog.author && ` · ${blog.author}`}
                    </p>
                    <h2 className="text-lg font-semibold mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                    {blog.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {blog.excerpt}
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default BlogListingPage
