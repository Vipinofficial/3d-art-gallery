import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const { galleryId, galleryName } = await request.json()

    if (!galleryId || !galleryName) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Sanitize gallery name
    const sanitizedGalleryName = galleryName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    // Delete gallery folder
    const galleryDir = path.join(process.cwd(), "public", "uploads", "galleries", sanitizedGalleryName)

    try {
      await fs.rmdir(galleryDir, { recursive: true })
    } catch (error) {
      console.warn("Gallery folder may not exist:", error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete gallery error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete gallery" }, { status: 500 })
  }
}
