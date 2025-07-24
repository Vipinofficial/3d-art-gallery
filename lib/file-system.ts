"use client"

export interface FileSystemConfig {
  maxFileSize: number // in bytes
  allowedTypes: string[]
  baseUploadPath: string
  dataPath: string
}

const defaultConfig: FileSystemConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  baseUploadPath: "/uploads/galleries",
  dataPath: "/data",
}

class FileSystem {
  private config: FileSystemConfig

  constructor(config: Partial<FileSystemConfig> = {}) {
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

  // Upload file to server
  async uploadFile(
    file: File,
    galleryName: string,
    galleryId: string,
  ): Promise<{ success: boolean; filePath?: string; fileName?: string; error?: string }> {
    const validation = this.validateFile(file)
    if (!validation.isValid) {
      return { success: false, error: validation.error }
    }

    try {
      const fileName = this.generateFileName(file.name, galleryId)
      const galleryPath = this.createGalleryPath(galleryName)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("galleryName", galleryName)
      formData.append("galleryId", galleryId)
      formData.append("fileName", fileName)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        return { success: false, error: result.error || "Upload failed" }
      }

      return {
        success: true,
        filePath: result.filePath,
        fileName: fileName,
      }
    } catch (error) {
      return { success: false, error: "Upload failed. Please try again." }
    }
  }

  // Delete gallery folder and all its files
  async deleteGalleryFolder(galleryId: string, galleryName: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch("/api/delete-gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ galleryId, galleryName }),
      })

      const result = await response.json()

      if (!response.ok) {
        return { success: false, error: result.error || "Failed to delete gallery folder" }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to delete gallery folder" }
    }
  }

  // Delete specific file
  async deleteFile(
    galleryId: string,
    fileName: string,
    galleryName: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch("/api/delete-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ galleryId, fileName, galleryName }),
      })

      const result = await response.json()

      if (!response.ok) {
        return { success: false, error: result.error || "Failed to delete file" }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to delete file" }
    }
  }

  // Get storage statistics
  async getStorageStats(): Promise<{ totalFiles: number; totalSize: number; galleriesCount: number }> {
    try {
      const response = await fetch("/api/storage-stats")
      const result = await response.json()

      if (!response.ok) {
        return { totalFiles: 0, totalSize: 0, galleriesCount: 0 }
      }

      return result
    } catch (error) {
      return { totalFiles: 0, totalSize: 0, galleriesCount: 0 }
    }
  }
}

export const fileSystem = new FileSystem()
