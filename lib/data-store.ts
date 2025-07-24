"use client"

import { fileManager } from "./file-manager"

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
  fileName?: string // Added for file tracking
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
    artworkCount: 6,
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
    artworkCount: 4,
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
    artworkCount: 5,
    totalViews: 2103,
    totalLikes: 156,
    thumbnail: "/placeholder.svg?height=300&width=400&text=Urban+Art",
    isPublic: true,
    hasAdultContent: false,
    createdAt: "2024-01-05T14:00:00Z",
    updatedAt: "2024-01-22T09:15:00Z",
  },
  {
    id: "gallery-4",
    name: "Abstract Minds",
    owner: "Sarah Johnson",
    ownerId: "user-4",
    description: "Exploring the boundaries of abstract digital art and consciousness",
    artworkCount: 3,
    totalViews: 743,
    totalLikes: 45,
    thumbnail: "/placeholder.svg?height=300&width=400&text=Abstract+Art",
    isPublic: true,
    hasAdultContent: false,
    createdAt: "2024-01-12T16:00:00Z",
    updatedAt: "2024-01-19T11:45:00Z",
  },
]

// Default artworks for the galleries
const defaultArtworks: Artwork[] = [
  // Gallery 1 - Digital Dreams
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
  // Gallery 2 - Nature's Canvas
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
  // Gallery 3 - Urban Expressions
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

  constructor() {
    this.loadData()
  }

  private loadData() {
    // Load from localStorage or use defaults
    const savedGalleries = localStorage.getItem("artverse_galleries")
    const savedArtworks = localStorage.getItem("artverse_artworks")
    const savedUsers = localStorage.getItem("artverse_users")

    this.galleries = savedGalleries ? JSON.parse(savedGalleries) : [...defaultGalleries]
    this.artworks = savedArtworks ? JSON.parse(savedArtworks) : [...defaultArtworks]
    this.users = savedUsers ? JSON.parse(savedUsers) : []
  }

  private saveData() {
    localStorage.setItem("artverse_galleries", JSON.stringify(this.galleries))
    localStorage.setItem("artverse_artworks", JSON.stringify(this.artworks))
    localStorage.setItem("artverse_users", JSON.stringify(this.users))
  }

  // Gallery methods
  getAllGalleries(): Gallery[] {
    return this.galleries.filter((g) => g.isPublic)
  }

  getGalleryById(id: string): Gallery | undefined {
    return this.galleries.find((g) => g.id === id)
  }

  getUserGallery(userId: string): Gallery | undefined {
    return this.galleries.find((g) => g.ownerId === userId)
  }

  createGallery(gallery: Omit<Gallery, "id" | "createdAt" | "updatedAt">): Gallery {
    const newGallery: Gallery = {
      ...gallery,
      id: `gallery-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.galleries.push(newGallery)
    this.saveData()
    return newGallery
  }

  updateGallery(id: string, updates: Partial<Gallery>): Gallery | null {
    const index = this.galleries.findIndex((g) => g.id === id)
    if (index === -1) return null

    this.galleries[index] = {
      ...this.galleries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.saveData()
    return this.galleries[index]
  }

  // Enhanced delete gallery method with file cleanup
  async deleteGallery(id: string): Promise<{ success: boolean; error?: string }> {
    const gallery = this.galleries.find((g) => g.id === id)
    if (!gallery) {
      return { success: false, error: "Gallery not found" }
    }

    try {
      // Delete all artworks in the gallery first
      const galleryArtworks = this.artworks.filter((a) => a.galleryId === id)

      // Delete individual artwork files
      for (const artwork of galleryArtworks) {
        if (artwork.fileName) {
          await fileManager.deleteFile(id, artwork.fileName)
        }
      }

      // Delete the entire gallery folder
      const folderDeletion = await fileManager.deleteGalleryFolder(id, gallery.name)
      if (!folderDeletion.success) {
        console.warn("Failed to delete gallery folder:", folderDeletion.error)
      }

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

      this.saveData()
      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to delete gallery" }
    }
  }

  // Artwork methods
  getArtworksByGallery(galleryId: string): Artwork[] {
    return this.artworks.filter((a) => a.galleryId === galleryId)
  }

  getArtworkById(id: string): Artwork | undefined {
    return this.artworks.find((a) => a.id === id)
  }

  addArtwork(artwork: Omit<Artwork, "id" | "createdAt">): Artwork {
    const newArtwork: Artwork = {
      ...artwork,
      id: `art-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    this.artworks.push(newArtwork)

    // Update gallery artwork count
    const gallery = this.galleries.find((g) => g.id === artwork.galleryId)
    if (gallery) {
      gallery.artworkCount = this.getArtworksByGallery(artwork.galleryId).length + 1
      gallery.updatedAt = new Date().toISOString()
    }

    this.saveData()
    return newArtwork
  }

  // Enhanced remove artwork method with file cleanup
  async removeArtwork(id: string): Promise<{ success: boolean; error?: string }> {
    const artwork = this.artworks.find((a) => a.id === id)
    if (!artwork) {
      return { success: false, error: "Artwork not found" }
    }

    try {
      // Delete the artwork file if it exists
      if (artwork.fileName) {
        const fileDeletion = await fileManager.deleteFile(artwork.galleryId, artwork.fileName)
        if (!fileDeletion.success) {
          console.warn("Failed to delete artwork file:", fileDeletion.error)
        }
      }

      // Remove artwork from data store
      this.artworks = this.artworks.filter((a) => a.id !== id)

      // Update gallery artwork count
      const gallery = this.galleries.find((g) => g.id === artwork.galleryId)
      if (gallery) {
        gallery.artworkCount = this.getArtworksByGallery(artwork.galleryId).length
        gallery.updatedAt = new Date().toISOString()
      }

      this.saveData()
      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to delete artwork" }
    }
  }

  updateArtwork(id: string, updates: Partial<Artwork>): Artwork | null {
    const index = this.artworks.findIndex((a) => a.id === id)
    if (index === -1) return null

    this.artworks[index] = { ...this.artworks[index], ...updates }
    this.saveData()
    return this.artworks[index]
  }

  // User methods
  createUser(user: Omit<User, "id" | "createdAt">): User {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    this.users.push(newUser)
    this.saveData()
    return newUser
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email)
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const index = this.users.findIndex((u) => u.id === id)
    if (index === -1) return null

    this.users[index] = { ...this.users[index], ...updates }
    this.saveData()
    return this.users[index]
  }

  // Like artwork
  likeArtwork(artworkId: string): boolean {
    const artwork = this.artworks.find((a) => a.id === artworkId)
    if (!artwork) return false

    artwork.likes += 1
    this.saveData()
    return true
  }

  // View artwork
  viewArtwork(artworkId: string): boolean {
    const artwork = this.artworks.find((a) => a.id === artworkId)
    if (!artwork) return false

    artwork.views += 1
    this.saveData()
    return true
  }

  // Get storage statistics
  getStorageStats() {
    return fileManager.getStorageStats()
  }
}

export const dataStore = new DataStore()
