"use client"

export interface FileManagerConfig {
  maxFileSize: number // in bytes
  allowedTypes: string[]
  baseUploadPath: string
}

const defaultConfig: FileManagerConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  baseUploadPath: "/uploads/galleries",
}

class FileManager {
  private config: FileManagerConfig

  constructor(config: Partial<FileManagerConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  // Validate file before upload
  validateFile(file: File): { isValid: boolean; error?: string } {
    if (!this.config.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${this.config.allowedTypes.join(", ")}`,
      }
    }

    if (file.size > this.config.maxFileSize) {
      return {
        isValid: false,
        error: `File too large. Maximum size: ${(this.config.maxFileSize / (1024 * 1024)).toFixed(1)}MB`,
      }
    }

    return { isValid: true }
  }

  // Create gallery folder path
  createGalleryPath(galleryName: string): string {
    // Sanitize gallery name for folder creation
    const sanitizedName = galleryName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    return `${this.config.baseUploadPath}/${sanitizedName}`
  }

  // Generate unique filename
  generateFileName(originalName: string, galleryId: string): string {
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const extension = originalName.split(".").pop()?.toLowerCase() || "jpg"

    return `${galleryId}-${timestamp}-${randomId}.${extension}`
  }

  // Simulate file upload (in real app, this would upload to server)
  async uploadFile(
    file: File,
    galleryName: string,
    galleryId: string,
  ): Promise<{ success: boolean; filePath?: string; error?: string }> {
    const validation = this.validateFile(file)
    if (!validation.isValid) {
      return { success: false, error: validation.error }
    }

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const galleryPath = this.createGalleryPath(galleryName)
      const fileName = this.generateFileName(file.name, galleryId)
      const fullPath = `${galleryPath}/${fileName}`

      // In a real application, you would:
      // 1. Create the gallery folder on the server
      // 2. Upload the file to that folder
      // 3. Return the actual file path

      // For demo purposes, we'll store file info in localStorage
      this.storeFileInfo(galleryId, galleryName, fileName, fullPath, file)

      return { success: true, filePath: fullPath }
    } catch (error) {
      return { success: false, error: "Upload failed. Please try again." }
    }
  }

  // Store file information locally (for demo purposes)
  private storeFileInfo(galleryId: string, galleryName: string, fileName: string, filePath: string, file: File) {
    const fileInfo = {
      galleryId,
      galleryName,
      fileName,
      filePath,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    }

    // Get existing files
    const existingFiles = JSON.parse(localStorage.getItem("artverse_files") || "[]")
    existingFiles.push(fileInfo)

    // Store updated files list
    localStorage.setItem("artverse_files", JSON.stringify(existingFiles))
  }

  // Get files for a gallery
  getGalleryFiles(galleryId: string): any[] {
    const files = JSON.parse(localStorage.getItem("artverse_files") || "[]")
    return files.filter((file: any) => file.galleryId === galleryId)
  }

  // Delete gallery folder and all its files
  async deleteGalleryFolder(galleryId: string, galleryName: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get all files for this gallery
      const allFiles = JSON.parse(localStorage.getItem("artverse_files") || "[]")
      const galleryFiles = allFiles.filter((file: any) => file.galleryId === galleryId)

      // Remove gallery files from storage
      const remainingFiles = allFiles.filter((file: any) => file.galleryId !== galleryId)
      localStorage.setItem("artverse_files", JSON.stringify(remainingFiles))

      // In a real application, you would:
      // 1. Delete all files in the gallery folder
      // 2. Remove the gallery folder itself
      // 3. Clean up any CDN or cloud storage references

      console.log(`Deleted gallery folder: ${this.createGalleryPath(galleryName)}`)
      console.log(`Removed ${galleryFiles.length} files`)

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to delete gallery folder" }
    }
  }

  // Delete specific file
  async deleteFile(galleryId: string, fileName: string): Promise<{ success: boolean; error?: string }> {
    try {
      const allFiles = JSON.parse(localStorage.getItem("artverse_files") || "[]")
      const updatedFiles = allFiles.filter((file: any) => !(file.galleryId === galleryId && file.fileName === fileName))

      localStorage.setItem("artverse_files", JSON.stringify(updatedFiles))

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to delete file" }
    }
  }

  // Get storage statistics
  getStorageStats(): { totalFiles: number; totalSize: number; galleriesCount: number } {
    const files = JSON.parse(localStorage.getItem("artverse_files") || "[]")
    const totalFiles = files.length
    const totalSize = files.reduce((sum: number, file: any) => sum + (file.size || 0), 0)
    const galleriesCount = new Set(files.map((file: any) => file.galleryId)).size

    return { totalFiles, totalSize, galleriesCount }
  }
}

export const fileManager = new FileManager()
