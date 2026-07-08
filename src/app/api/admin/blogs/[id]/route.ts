import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { title, slug, excerpt, content, coverImage, author, published, seoTitle, seoDescription, seoKeywords } = body

    const existing = await prisma.blog.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.blog.findUnique({ where: { slug } })
      if (slugExists) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
      }
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(author !== undefined && { author }),
        ...(published !== undefined && { published }),
        ...(seoTitle !== undefined && { seoTitle }),
        ...(seoDescription !== undefined && { seoDescription }),
        ...(seoKeywords !== undefined && { seoKeywords }),
      },
    })

    return NextResponse.json({ blog })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params

    const existing = await prisma.blog.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    await prisma.blog.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
