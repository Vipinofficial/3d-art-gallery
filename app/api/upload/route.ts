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
    const fileName = formData.get("fileName") as string

    if (!file || !galleryName || !galleryId || !fileName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create gallery folder path
    const sanitizedGalleryName = galleryName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    const galleryPath = path.join(process.cwd(), "public", "uploads", "galleries", sanitizedGalleryName)

    // Create directory if it doesn't exist
    if (!existsSync(galleryPath)) {
      await mkdir(galleryPath, { recursive: true })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write file to disk
    const filePath = path.join(galleryPath, fileName)
    await writeFile(filePath, buffer)

    // Return the public URL path
    const publicPath = `/uploads/galleries/${sanitizedGalleryName}/${fileName}`

    return NextResponse.json({
      success: true,
      filePath: publicPath,
      fileName: fileName,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
