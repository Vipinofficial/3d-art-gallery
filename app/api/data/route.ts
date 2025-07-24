import { type NextRequest, NextResponse } from "next/server"
import { readFile, writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "artverse-data.json")

// Default data structure
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
  ],
  users: [],
}

async function ensureDataFile() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }

  if (!existsSync(DATA_FILE)) {
    await writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2))
  }
}

export async function GET() {
  try {
    await ensureDataFile()
    const data = await readFile(DATA_FILE, "utf-8")
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
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving data:", error)
    return NextResponse.json({ success: false, error: "Failed to save data" }, { status: 500 })
  }
}
