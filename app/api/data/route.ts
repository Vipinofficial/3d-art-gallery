import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const dataFile = path.join(dataDir, "artverse-data.json")

// Default data
const defaultData = {
  galleries: [
    {
      id: "gallery-1",
      name: "Digital Dreams",
      owner: "Alex Chen",
      ownerId: "user-1",
      description:
        "A collection of futuristic digital artworks exploring the boundaries between reality and imagination",
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
  ],
  artworks: [
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
  ],
  users: [],
}

async function ensureDataFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true })
    await fs.access(dataFile)
  } catch (error) {
    // File doesn't exist, create it with default data
    await fs.writeFile(dataFile, JSON.stringify(defaultData, null, 2))
  }
}

export async function GET() {
  try {
    await ensureDataFile()
    const data = await fs.readFile(dataFile, "utf-8")
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    console.error("Error reading data:", error)
    return NextResponse.json(defaultData)
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataFile()
    const data = await request.json()
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving data:", error)
    return NextResponse.json({ success: false, error: "Failed to save data" }, { status: 500 })
  }
}
