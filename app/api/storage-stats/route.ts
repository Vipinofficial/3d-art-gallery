import { NextResponse } from "next/server"
import { readdir, stat } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function GET() {
  try {
    const uploadsPath = path.join(process.cwd(), "public", "uploads", "galleries")

    if (!existsSync(uploadsPath)) {
      return NextResponse.json({ totalFiles: 0, totalSize: 0, galleriesCount: 0 })
    }

    const galleries = await readdir(uploadsPath)
    let totalFiles = 0
    let totalSize = 0

    for (const gallery of galleries) {
      const galleryPath = path.join(uploadsPath, gallery)
      const files = await readdir(galleryPath)

      for (const file of files) {
        const filePath = path.join(galleryPath, file)
        const stats = await stat(filePath)
        totalFiles++
        totalSize += stats.size
      }
    }

    return NextResponse.json({
      totalFiles,
      totalSize,
      galleriesCount: galleries.length,
    })
  } catch (error) {
    console.error("Storage stats error:", error)
    return NextResponse.json({ totalFiles: 0, totalSize: 0, galleriesCount: 0 })
  }
}
