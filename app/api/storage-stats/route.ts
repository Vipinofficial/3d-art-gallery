import { NextResponse } from "next/server"
import { readdir, stat } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function GET() {
  try {
    const galleriesDir = path.join(process.cwd(), "public", "uploads", "galleries")

    if (!existsSync(galleriesDir)) {
      return NextResponse.json({ totalFiles: 0, totalSize: 0, galleriesCount: 0 })
    }

    const galleries = await readdir(galleriesDir)
    let totalFiles = 0
    let totalSize = 0

    for (const gallery of galleries) {
      const galleryPath = path.join(galleriesDir, gallery)
      const galleryStat = await stat(galleryPath)

      if (galleryStat.isDirectory()) {
        const files = await readdir(galleryPath)
        totalFiles += files.length

        for (const file of files) {
          const filePath = path.join(galleryPath, file)
          const fileStat = await stat(filePath)
          totalSize += fileStat.size
        }
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
