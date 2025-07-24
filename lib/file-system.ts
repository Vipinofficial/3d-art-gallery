"use client"

export interface FileSystemConfig {
  maxFileSize: number // in bytes
  allowedTypes: string[]
  baseUploadPath: string
}

const defaultConfig: FileSystemConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  baseUploadPath: "/uploads/galleries",
}

export interface UploadResult {
  success: boolean
  filePath?: string
  fileName?: string
  error?: string
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

  // Generate unique filename
  generateFileName(originalName: string, galleryId: string): string {
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const extension = originalName.split(".").pop()?.toLowerCase() || "jpg"
    return `${galleryId}-${timestamp}-${randomId}.${extension}`
  }

  // Upload file to server
  async uploadFile(file: File, galleryName: string, galleryId: string): Promise<UploadResult> {
    const validation = this.validateFile(file)
    if (!validation.isValid) {
      return { success: false, error: validation.error }
    }

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("galleryName", galleryName)
      formData.append("galleryId", galleryId)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: "Upload failed. Please try again." }
    }
  }

  // Delete file from server
  async deleteFile(galleryId: string, fileName: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch("/api/delete-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ galleryId, fileName }),
      })

      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: "Failed to delete file" }
    }
  }

  // Delete entire gallery folder
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
      return result
    } catch (error) {
      return { success: false, error: "Failed to delete gallery folder" }
    }
  }

  // Get storage statistics
  async getStorageStats(): Promise<{ totalFiles: number; totalSize: number; galleriesCount: number }> {
    try {
      const response = await fetch("/api/storage-stats")
      const result = await response.json()
      return result
    } catch (error) {
      return { totalFiles: 0, totalSize: 0, galleriesCount: 0 }
    }
  }
}

export const fileSystem = new FileSystem()
