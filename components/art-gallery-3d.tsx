"use client"

import { useState, useEffect, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Text, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Eye, ShoppingCart } from "lucide-react"
import { dataStore, type Gallery, type Artwork } from "@/lib/data-store"

interface ArtGallery3DProps {
  selectedGallery: Gallery
  onBack: () => void
  user: any
}

function ArtworkFrame({
  artwork,
  position,
  onClick,
}: { artwork: Artwork; position: [number, number, number]; onClick: () => void }) {
  return (
    <group position={position} onClick={onClick}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[2.2, 1.7, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Artwork */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial>
          <Html
            transform
            occlude
            position={[0, 0, 0]}
            style={{
              width: "200px",
              height: "150px",
              pointerEvents: "none",
            }}
          >
            <img
              src={artwork.image || "/placeholder.svg"}
              alt={artwork.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
          </Html>
        </meshStandardMaterial>
      </mesh>

      {/* Info Panel */}
      <Html position={[0, -1.2, 0]} center>
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg min-w-[200px] text-center">
          <h3 className="font-semibold text-gray-900 text-sm">{artwork.title}</h3>
          <p className="text-xs text-gray-600">{artwork.artist}</p>
          <p className="text-sm font-bold text-green-600">${artwork.price}</p>
          <div className="flex justify-center items-center space-x-3 mt-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{artwork.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>{artwork.likes}</span>
            </div>
          </div>
          {artwork.hasAdultContent && (
            <Badge variant="destructive" className="bg-orange-500 text-xs mt-1">
              18+
            </Badge>
          )}
        </div>
      </Html>
    </group>
  )
}

function GalleryRoom({
  artworks,
  onArtworkClick,
}: { artworks: Artwork[]; onArtworkClick: (artwork: Artwork) => void }) {
  // Position artworks around the room
  const positions: [number, number, number][] = [
    [-4, 1, -4], // Left wall
    [0, 1, -4], // Back wall left
    [4, 1, -4], // Back wall right
    [4, 1, 0], // Right wall
    [4, 1, 4], // Right wall front
    [0, 1, 4], // Front wall
  ]

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2, -6]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-6, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[6, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Gallery Title */}
      <Text position={[0, 4, -5.9]} fontSize={0.5} color="#333333" anchorX="center" anchorY="middle">
        Welcome to the Gallery
      </Text>

      {/* Artworks */}
      {artworks.slice(0, 6).map((artwork, index) => (
        <ArtworkFrame
          key={artwork.id}
          artwork={artwork}
          position={positions[index] || [0, 1, 0]}
          onClick={() => onArtworkClick(artwork)}
        />
      ))}
    </group>
  )
}

export function ArtGallery3D({ selectedGallery, onBack, user }: ArtGallery3DProps) {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadArtworks()
  }, [selectedGallery.id])

  const loadArtworks = async () => {
    try {
      const galleryArtworks = await dataStore.getArtworksByGallery(selectedGallery.id)
      setArtworks(galleryArtworks)
    } catch (error) {
      console.error("Failed to load artworks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleArtworkClick = async (artwork: Artwork) => {
    setSelectedArtwork(artwork)
    // Track view
    await dataStore.viewArtwork(artwork.id)
    // Reload artworks to update view count
    loadArtworks()
  }

  const handleLikeArtwork = async (artwork: Artwork) => {
    await dataStore.likeArtwork(artwork.id)
    loadArtworks()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-black relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Galleries
            </Button>
            <div className="text-white">
              <h1 className="text-xl font-bold">{selectedGallery.name}</h1>
              <p className="text-sm opacity-80">by {selectedGallery.owner}</p>
            </div>
          </div>
          <div className="text-white text-sm">{artworks.length} artworks</div>
        </div>
      </div>

      {/* 3D Gallery */}
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[0, 5, 0]} intensity={0.5} />

          <GalleryRoom artworks={artworks} onArtworkClick={handleArtworkClick} />

          <Environment preset="studio" />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={15}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>

      {/* Artwork Detail Panel */}
      {selectedArtwork && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-xl">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{selectedArtwork.title}</h3>
              <p className="text-gray-600">by {selectedArtwork.artist}</p>
              <p className="text-sm text-gray-500 mt-1">{selectedArtwork.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-lg font-bold text-green-600">${selectedArtwork.price}</span>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{selectedArtwork.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{selectedArtwork.likes}</span>
                  </div>
                </div>
                {selectedArtwork.hasAdultContent && (
                  <Badge variant="destructive" className="bg-orange-500">
                    18+
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLikeArtwork(selectedArtwork)}
                className="flex items-center space-x-1"
              >
                <Heart className="w-4 h-4" />
                <span>Like</span>
              </Button>
              <Button size="sm" className="flex items-center space-x-1">
                <ShoppingCart className="w-4 h-4" />
                <span>Buy</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedArtwork(null)}>
                ×
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-20 right-4 bg-black/50 backdrop-blur-sm text-white p-3 rounded-lg text-sm">
        <p>🖱️ Click and drag to look around</p>
        <p>🖼️ Click on artworks to view details</p>
        <p>🔍 Scroll to zoom in/out</p>
      </div>
    </div>
  )
}
