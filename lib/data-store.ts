"use client"

export interface Artwork {
  id: string
  title: string
  artist: string
  artistId: string
  price: number
  image: string
  description?: string
  category?: string
  likes: number
  views: number
  sales: number
  hasAdultContent: boolean
  createdAt: string
  galleryId: string
  fileName?: string
}

export interface Gallery {
  id: string
  name: string
  owner: string
  ownerId: string
  description: string
  artworkCount: number
  totalViews: number
  totalLikes: number
  thumbnail: string
  isPublic: boolean
  hasAdultContent: boolean
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  hasGallery: boolean
  galleryId?: string
  acceptedTerms: boolean
  createdAt: string
}

class DataStore {
  private galleries: Gallery[] = []
  private artworks: Artwork[] = []
  private users: User[] = []
  private initialized = false

  constructor() {
    // Only initialize on client side
    if (typeof window !== "undefined") {
      this.initializeData()
    }
  }

  private async initializeData() {
    if (this.initialized) return
    await this.loadData()
    this.initialized = true
  }

  private async ensureInitialized() {
    if (!this.initialized && typeof window !== "undefined") {
      await this.initializeData()
    }
  }

  private async loadData() {
    try {
      const response = await fetch("/api/data")
      if (response.ok) {
        const data = await response.json()
        this.galleries = data.galleries || []
        this.artworks = data.artworks || []
        this.users = data.users || []
      }
    } catch (error) {
      console.warn("Failed to load data from server:", error)
      this.galleries = []
      this.artworks = []
      this.users = []
    }
  }

  private async saveData() {
    if (typeof window === "undefined") return

    try {
      await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          galleries: this.galleries,
          artworks: this.artworks,
          users: this.users,
        }),
      })
    } catch (error) {
      console.warn("Failed to save data to server:", error)
    }
  }

  // Gallery methods
  async getAllGalleries(): Promise<Gallery[]> {
    await this.ensureInitialized()
    return this.galleries.filter((g) => g.isPublic)
  }

  async getGalleryById(id: string): Promise<Gallery | undefined> {
    await this.ensureInitialized()
    return this.galleries.find((g) => g.id === id)
  }

  async getUserGallery(userId: string): Promise<Gallery | undefined> {
    await this.ensureInitialized()
    return this.galleries.find((g) => g.ownerId === userId)
  }

  async createGallery(gallery: Omit<Gallery, "id" | "createdAt" | "updatedAt">): Promise<Gallery> {
    await this.ensureInitialized()
    const newGallery: Gallery = {
      ...gallery,
      id: `gallery-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.galleries.push(newGallery)
    await this.saveData()
    return newGallery
  }

  async updateGallery(id: string, updates: Partial<Gallery>): Promise<Gallery | null> {
    await this.ensureInitialized()
    const index = this.galleries.findIndex((g) => g.id === id)
    if (index === -1) return null

    this.galleries[index] = {
      ...this.galleries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    await this.saveData()
    return this.galleries[index]
  }

  async deleteGallery(id: string): Promise<{ success: boolean; error?: string }> {
    await this.ensureInitialized()
    const gallery = this.galleries.find((g) => g.id === id)
    if (!gallery) {
      return { success: false, error: "Gallery not found" }
    }

    try {
      // Remove artworks from data store
      this.artworks = this.artworks.filter((a) => a.galleryId !== id)

      // Remove gallery from data store
      this.galleries = this.galleries.filter((g) => g.id !== id)

      // Update user to remove gallery reference
      const user = this.users.find((u) => u.id === gallery.ownerId)
      if (user) {
        user.hasGallery = false
        delete user.galleryId
      }

      await this.saveData()
      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to delete gallery" }
    }
  }

  // Artwork methods
  async getArtworksByGallery(galleryId: string): Promise<Artwork[]> {
    await this.ensureInitialized()
    return this.artworks.filter((a) => a.galleryId === galleryId)
  }

  async getArtworkById(id: string): Promise<Artwork | undefined> {
    await this.ensureInitialized()
    return this.artworks.find((a) => a.id === id)
  }

  async addArtwork(artwork: Omit<Artwork, "id" | "createdAt">): Promise<Artwork> {
    await this.ensureInitialized()
    const newArtwork: Artwork = {
      ...artwork,
      id: `art-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    this.artworks.push(newArtwork)

    // Update gallery artwork count
    const gallery = this.galleries.find((g) => g.id === artwork.galleryId)
    if (gallery) {
      gallery.artworkCount = this.artworks.filter((a) => a.galleryId === artwork.galleryId).length
      gallery.updatedAt = new Date().toISOString()
    }

    await this.saveData()
    return newArtwork
  }

  async removeArtwork(id: string): Promise<{ success: boolean; error?: string }> {
    await this.ensureInitialized()
    const artwork = this.artworks.find((a) => a.id === id)
    if (!artwork) {
      return { success: false, error: "Artwork not found" }
    }

    try {
      // Remove artwork from data store
      this.artworks = this.artworks.filter((a) => a.id !== id)

      // Update gallery artwork count
      const gallery = this.galleries.find((g) => g.id === artwork.galleryId)
      if (gallery) {
        gallery.artworkCount = this.artworks.filter((a) => a.galleryId === artwork.galleryId).length
        gallery.updatedAt = new Date().toISOString()
      }

      await this.saveData()
      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to delete artwork" }
    }
  }

  async updateArtwork(id: string, updates: Partial<Artwork>): Promise<Artwork | null> {
    await this.ensureInitialized()
    const index = this.artworks.findIndex((a) => a.id === id)
    if (index === -1) return null

    this.artworks[index] = { ...this.artworks[index], ...updates }
    await this.saveData()
    return this.artworks[index]
  }

  // User methods
  async createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    await this.ensureInitialized()
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    this.users.push(newUser)
    await this.saveData()
    return newUser
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.ensureInitialized()
    return this.users.find((u) => u.email === email)
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    await this.ensureInitialized()
    const index = this.users.findIndex((u) => u.id === id)
    if (index === -1) return null

    this.users[index] = { ...this.users[index], ...updates }
    await this.saveData()
    return this.users[index]
  }

  async likeArtwork(artworkId: string): Promise<boolean> {
    await this.ensureInitialized()
    const artwork = this.artworks.find((a) => a.id === artworkId)
    if (!artwork) return false

    artwork.likes += 1
    await this.saveData()
    return true
  }

  async viewArtwork(artworkId: string): Promise<boolean> {
    await this.ensureInitialized()
    const artwork = this.artworks.find((a) => a.id === artworkId)
    if (!artwork) return false

    artwork.views += 1
    await this.saveData()
    return true
  }
}

// Create singleton instance only on client side
let dataStoreInstance: DataStore | null = null

export const getDataStore = (): DataStore => {
  if (typeof window === "undefined") {
    // Return a mock instance for SSR
    return {} as DataStore
  }

  if (!dataStoreInstance) {
    dataStoreInstance = new DataStore()
  }
  return dataStoreInstance
}

export const dataStore = getDataStore()
