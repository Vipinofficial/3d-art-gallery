import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
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

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "galleries")
    await fs.mkdir(uploadsDir, { recursive: true })

    // Create gallery-specific directory
    const sanitizedGalleryName = galleryName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    const galleryDir = path.join(uploadsDir, sanitizedGalleryName)
    await fs.mkdir(galleryDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const extension = path.extname(file.name)
    const fileName = `${galleryId}-${timestamp}-${randomId}${extension}`

    // Save file
    const filePath = path.join(galleryDir, fileName)
    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(filePath, buffer)

    // Return file info
    const fileUrl = `/uploads/galleries/${sanitizedGalleryName}/${fileName}`

    return NextResponse.json({
      success: true,
      filePath: fileUrl,
      fileName: fileName,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 })
  }
}
