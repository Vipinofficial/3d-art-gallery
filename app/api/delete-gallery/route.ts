import { type NextRequest, NextResponse } from "next/server"
import { rm } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const { galleryId, galleryName } = await request.json()

    if (!galleryId || !galleryName) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Create gallery folder path
    const sanitizedGalleryName = galleryName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    const galleryDir = path.join(process.cwd(), "public", "uploads", "galleries", sanitizedGalleryName)

    // Delete directory if it exists
    if (existsSync(galleryDir)) {
      await rm(galleryDir, { recursive: true, force: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete gallery error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete gallery folder" }, { status: 500 })
  }
}
