import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "galleries")

    let totalFiles = 0
    let totalSize = 0
    let galleriesCount = 0

    try {
      const galleries = await fs.readdir(uploadsDir)
      galleriesCount = galleries.length

      for (const gallery of galleries) {
        const galleryPath = path.join(uploadsDir, gallery)
        const stat = await fs.stat(galleryPath)

        if (stat.isDirectory()) {
          const files = await fs.readdir(galleryPath)
          totalFiles += files.length

          for (const file of files) {
            const filePath = path.join(galleryPath, file)
            const fileStat = await fs.stat(filePath)
            totalSize += fileStat.size
          }
        }
      }
    } catch (error) {
      // Directory doesn't exist yet
      console.warn("Uploads directory doesn't exist yet:", error)
    }

    return NextResponse.json({
      totalFiles,
      totalSize,
      galleriesCount,
    })
  } catch (error) {
    console.error("Storage stats error:", error)
    return NextResponse.json({
      totalFiles: 0,
      totalSize: 0,
      galleriesCount: 0,
    })
  }
}
