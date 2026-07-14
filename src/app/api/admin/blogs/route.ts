import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ blogs })
  } catch (err) {
    console.error("GET /api/admin/blogs error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, slug, excerpt, content, coverImage, author, published, seoTitle, seoDescription, seoKeywords } = body

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 })
    }

    const existing = await prisma.blog.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        author,
        published: published ?? false,
        seoTitle,
        seoDescription,
        seoKeywords,
      },
    })

    return NextResponse.json({ blog }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
