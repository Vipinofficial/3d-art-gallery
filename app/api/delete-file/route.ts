import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const { galleryId, fileName, galleryName } = await request.json()

    if (!galleryId || !fileName || !galleryName) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Sanitize gallery name
    const sanitizedGalleryName = galleryName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    // Delete specific file
    const filePath = path.join(process.cwd(), "public", "uploads", "galleries", sanitizedGalleryName, fileName)

    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.warn("File may not exist:", error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete file error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete file" }, { status: 500 })
  }
}
