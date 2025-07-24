"use client"

import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import { Suspense, useState, useEffect } from "react"
import { ModernGallery } from "@/components/modern-gallery"
import { GalleryUI } from "@/components/gallery-ui"
import { LoadingScreen } from "@/components/loading-screen"
import { dataStore, type Artwork } from "@/lib/data-store"

interface ArtGallery3DProps {
  user: any
  gallery: any
  onBackToGalleries: () => void
  onCheckout: (items: any[]) => void
  onLogout: () => void
  onOpenDashboard: () => void
}

export function ArtGallery3D({
  user,
  gallery,
  onBackToGalleries,
  onCheckout,
  onLogout,
  onOpenDashboard,
}: ArtGallery3DProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null)
  const [cart, setCart] = useState<any[]>([])
  const [galleryArtworks, setGalleryArtworks] = useState<Artwork[]>([])

  useEffect(() => {
    // Load artworks for this gallery
    const artworks = dataStore.getArtworksByGallery(gallery.id)

    // Add position data for 3D display
    const positions = [
      [-4, 1.5, -2.9],
      [0, 1.5, -2.9],
      [4, 1.5, -2.9],
      [-2, 1.5, 2.9],
      [2, 1.5, 2.9],
      [0, 1.5, 5.9],
    ]

    const artworksWithPositions = artworks.map((artwork, index) => ({
      ...artwork,
      position: positions[index] || [0, 1.5, 0],
    }))

    setGalleryArtworks(artworksWithPositions)
  }, [gallery.id])

  const addToCart = (artwork: any) => {
    setCart((prev) => [...prev, artwork])
  }

  const likeArtwork = (artworkId: string) => {
    dataStore.likeArtwork(artworkId)
    // Update local state
    setGalleryArtworks((prev) => prev.map((art) => (art.id === artworkId ? { ...art, likes: art.likes + 1 } : art)))
  }

  const viewArtwork = (artwork: any) => {
    dataStore.viewArtwork(artwork.id)
    setSelectedArtwork(artwork)
  }

  const isOwner = user.id === gallery.ownerId

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }} shadows gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <Environment preset="city" />

          {/* Enhanced lighting for modern look */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight position={[-10, 10, -5]} intensity={0.8} />
          <pointLight position={[0, 8, 0]} intensity={0.5} color="#ffffff" />

          <ModernGallery
            artworks={galleryArtworks}
            onSelectArtwork={viewArtwork}
            onAddToCart={addToCart}
            onLikeArtwork={likeArtwork}
            galleryName={gallery.name}
          />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            minDistance={3}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>

      <GalleryUI
        selectedArtwork={selectedArtwork}
        setSelectedArtwork={setSelectedArtwork}
        cart={cart}
        setCart={setCart}
        onBackToGalleries={onBackToGalleries}
        onCheckout={onCheckout}
        onLogout={onLogout}
        onOpenDashboard={onOpenDashboard}
        galleryName={gallery.name}
        isOwner={isOwner}
      />

      <Suspense fallback={<LoadingScreen />}>
        <div />
      </Suspense>
    </div>
  )
}
