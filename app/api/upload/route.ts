import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const galleryName = formData.get("galleryName") as string
    const galleryId = formData.get("galleryId") as string

    if (!file || !galleryName || !galleryId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Create gallery folder path
    const sanitizedGalleryName = galleryName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    const galleryDir = path.join(process.cwd(), "public", "uploads", "galleries", sanitizedGalleryName)

    // Create directory if it doesn't exist
    if (!existsSync(galleryDir)) {
      await mkdir(galleryDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `${galleryId}-${timestamp}-${randomId}.${extension}`

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = path.join(galleryDir, fileName)

    await writeFile(filePath, buffer)

    // Return public URL path
    const publicPath = `/uploads/galleries/${sanitizedGalleryName}/${fileName}`

    return NextResponse.json({
      success: true,
      filePath: publicPath,
      fileName: fileName,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 })
  }
}
