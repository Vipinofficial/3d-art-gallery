import { type NextRequest, NextResponse } from "next/server"
import { rm } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const { galleryId, galleryName } = await request.json()

    if (!galleryId || !galleryName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create gallery folder path
    const sanitizedGalleryName = galleryName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    const galleryPath = path.join(process.cwd(), "public", "uploads", "galleries", sanitizedGalleryName)

    // Delete directory if it exists
    if (existsSync(galleryPath)) {
      await rm(galleryPath, { recursive: true, force: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete gallery error:", error)
    return NextResponse.json({ error: "Failed to delete gallery folder" }, { status: 500 })
  }
}
