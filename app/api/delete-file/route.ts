import { type NextRequest, NextResponse } from "next/server"
import { unlink } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const { galleryId, fileName, galleryName } = await request.json()

    if (!galleryId || !fileName || !galleryName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create gallery folder path
    const sanitizedGalleryName = galleryName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    const filePath = path.join(process.cwd(), "public", "uploads", "galleries", sanitizedGalleryName, fileName)

    // Delete file if it exists
    if (existsSync(filePath)) {
      await unlink(filePath)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete file error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
