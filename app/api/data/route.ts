import { type NextRequest, NextResponse } from "next/server"
import { readFile, writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "artverse-data.json")

// Ensure data directory exists
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

// Default data structure
const defaultData = {
  galleries: [],
  artworks: [],
  users: [],
}

export async function GET() {
  try {
    await ensureDataDir()

    if (existsSync(DATA_FILE)) {
      const data = await readFile(DATA_FILE, "utf-8")
      return NextResponse.json(JSON.parse(data))
    } else {
      // Return default data if file doesn't exist
      return NextResponse.json(defaultData)
    }
  } catch (error) {
    console.error("Error reading data:", error)
    return NextResponse.json(defaultData)
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataDir()

    const data = await request.json()
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
