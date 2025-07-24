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

// Default galleries with dummy data
const defaultGalleries: Gallery[] = [
  {
    id: "gallery-1",
    name: "Digital Dreams",
    owner: "Alex Chen",
    ownerId: "user-1",
    description: "A collection of futuristic digital artworks exploring the boundaries between reality and imagination",
    artworkCount: 3,
    totalViews: 1234,
    totalLikes: 89,
    thumbnail: "/placeholder.svg?height=300&width=400&text=Digital+Dreams",
    isPublic: true,
    hasAdultContent: false,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
  },
  {
    id: "gallery-2",
    name: "Nature's Canvas",
    owner: "Maya Rodriguez",
    ownerId: "user-2",
    description: "Beautiful landscapes and natural scenes captured through digital artistry",
    artworkCount: 2,
    totalViews: 856,
    totalLikes: 67,
    thumbnail: "/placeholder.svg?height=300&width=400&text=Nature+Canvas",
    isPublic: true,
    hasAdultContent: false,
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-18T12:00:00Z",
  },
  {
    id: "gallery-3",
    name: "Urban Expressions",
    owner: "David Kim",
    ownerId: "user-3",
    description: "Street art and city life captured in vibrant digital form",
    artworkCount: 2,
    totalViews: 2103,
    totalLikes: 156,
    thumbnail: "/placeholder.svg?height=300&width=400&text=Urban+Art",
    isPublic: true,
    hasAdultContent: false,
    createdAt: "2024-01-05T14:00:00Z",
    updatedAt: "2024-01-22T09:15:00Z",
  },
]

// Default artworks for the galleries
const defaultArtworks: Artwork[] = [
  {
    id: "art-1",
    title: "Cyber Metropolis",
    artist: "Alex Chen",
    artistId: "user-1",
    price: 299,
    image: "/placeholder.svg?height=400&width=400&text=Cyber+Metropolis",
    description: "A futuristic cityscape with neon lights and flying vehicles",
    category: "Digital Art",
    likes: 42,
    views: 156,
    sales: 3,
    hasAdultContent: false,
    createdAt: "2024-01-15T10:30:00Z",
    galleryId: "gallery-1",
  },
  {
    id: "art-2",
    title: "Neural Networks",
    artist: "Alex Chen",
    artistId: "user-1",
    price: 450,
    image: "/placeholder.svg?height=400&width=400&text=Neural+Networks",
    description: "Abstract representation of artificial intelligence",
    category: "Digital Art",
    likes: 67,
    views: 234,
    sales: 5,
    hasAdultContent: false,
    createdAt: "2024-01-16T14:00:00Z",
    galleryId: "gallery-1",
  },
  {
    id: "art-3",
    title: "Quantum Dreams",
    artist: "Alex Chen",
    artistId: "user-1",
    price: 350,
    image: "/placeholder.svg?height=400&width=400&text=Quantum+Dreams",
    description: "Visualization of quantum mechanics and parallel universes",
    category: "Digital Art",
    likes: 28,
    views: 189,
    sales: 2,
    hasAdultContent: false,
    createdAt: "2024-01-17T09:15:00Z",
    galleryId: "gallery-1",
  },
  {
    id: "art-4",
    title: "Mountain Serenity",
    artist: "Maya Rodriguez",
    artistId: "user-2",
    price: 275,
    image: "/placeholder.svg?height=400&width=400&text=Mountain+Serenity",
    description: "Peaceful mountain landscape at sunrise",
    category: "Landscape",
    likes: 35,
    views: 198,
    sales: 4,
    hasAdultContent: false,
    createdAt: "2024-01-11T08:30:00Z",
    galleryId: "gallery-2",
  },
  {
    id: "art-5",
    title: "Ocean Depths",
    artist: "Maya Rodriguez",
    artistId: "user-2",
    price: 320,
    image: "/placeholder.svg?height=400&width=400&text=Ocean+Depths",
    description: "Mysterious underwater world with marine life",
    category: "Landscape",
    likes: 52,
    views: 267,
    sales: 6,
    hasAdultContent: false,
    createdAt: "2024-01-13T11:00:00Z",
    galleryId: "gallery-2",
  },
  {
    id: "art-6",
    title: "Street Symphony",
    artist: "David Kim",
    artistId: "user-3",
    price: 380,
    image: "/placeholder.svg?height=400&width=400&text=Street+Symphony",
    description: "Vibrant street art depicting urban music culture",
    category: "Street Art",
    likes: 78,
    views: 345,
    sales: 7,
    hasAdultContent: false,
    createdAt: "2024-01-06T15:20:00Z",
    galleryId: "gallery-3",
  },
  {
    id: "art-7",
    title: "City Pulse",
    artist: "David Kim",
    artistId: "user-3",
    price: 420,
    image: "/placeholder.svg?height=400&width=400&text=City+Pulse",
    description: "Dynamic representation of city energy and movement",
    category: "Street Art",
    likes: 91,
    views: 412,
    sales: 8,
    hasAdultContent: false,
    createdAt: "2024-01-08T12:45:00Z",
    galleryId: "gallery-3",
  },
]

class DataStore {
  private galleries: Gallery[] = []
  private artworks: Artwork[] = []
  private users: User[] = []
  private initialized = false

  constructor() {
    this.initializeData()
  }

  private async initializeData() {
    if (this.initialized) return
    await this.loadData()
    this.initialized = true
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initializeData()
    }
  }

  private async loadData() {
    try {
      // Load data from server
      const response = await fetch("/api/data")
      if (response.ok) {
        const data = await response.json()
        this.galleries = data.galleries || [...defaultGalleries]
        this.artworks = data.artworks || [...defaultArtworks]
        this.users = data.users || []
      } else {
        // Use default data if server request fails
        this.galleries = [...defaultGalleries]
        this.artworks = [...defaultArtworks]
        this.users = []
      }
    } catch (error) {
      console.warn("Failed to load data from server, using defaults:", error)
      this.galleries = [...defaultGalleries]
      this.artworks = [...defaultArtworks]
      this.users = []
    }
  }

  private async saveData() {
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

export const dataStore = new DataStore()
