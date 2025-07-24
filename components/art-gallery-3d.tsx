"use client"

import { Suspense, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { ModernGallery } from "./modern-gallery"
import { CreatorPortal } from "./creator-portal"
import { CheckoutPage } from "./checkout-page"
import { LoadingScreen } from "./loading-screen"
import { GalleryUI } from "./gallery-ui"
import { dataStore, type Gallery as GalleryType, type Artwork } from "@/lib/data-store"

interface ArtGallery3DProps {
  selectedGallery: GalleryType | null
  onBack: () => void
  user: any
}

export function ArtGallery3D({ selectedGallery, onBack, user }: ArtGallery3DProps) {
  const [currentView, setCurrentView] = useState<"gallery" | "creator" | "checkout">("gallery")
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (selectedGallery) {
      loadArtworks()
    }
  }, [selectedGallery])

  const loadArtworks = async () => {
    if (!selectedGallery) return

    try {
      const galleryArtworks = await dataStore.getArtworksByGallery(selectedGallery.id)
      setArtworks(galleryArtworks)
    } catch (error) {
      console.error("Failed to load artworks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddArtwork = async (newArtwork: any) => {
    if (!selectedGallery) return

    try {
      const artwork = await dataStore.addArtwork({
        ...newArtwork,
        artist: user.name,
        artistId: user.id,
        likes: 0,
        views: 0,
        sales: 0,
        hasAdultContent: false,
        galleryId: selectedGallery.id,
      })

      await loadArtworks() // Reload artworks
    } catch (error) {
      console.error("Failed to add artwork:", error)
    }
  }

  const handleArtworkSelect = (artwork: Artwork) => {
    setSelectedArtwork(artwork)
    setCurrentView("checkout")
  }

  const handleLikeArtwork = async (artworkId: string) => {
    try {
      await dataStore.likeArtwork(artworkId)
      await loadArtworks() // Reload to get updated likes
    } catch (error) {
      console.error("Failed to like artwork:", error)
    }
  }

  const handleViewArtwork = async (artworkId: string) => {
    try {
      await dataStore.viewArtwork(artworkId)
      await loadArtworks() // Reload to get updated views
    } catch (error) {
      console.error("Failed to record view:", error)
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (!selectedGallery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Gallery Selected</h2>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Galleries
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }} shadows className="w-full h-full">
        <Suspense
          fallback={
            <Html center>
              <LoadingScreen />
            </Html>
          }
        >
          <Environment preset="warehouse" />

          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[0, 10, 0]} intensity={0.5} />

          {currentView === "gallery" && (
            <ModernGallery
              artworks={artworks}
              onArtworkSelect={handleArtworkSelect}
              onNavigateToCreator={() => setCurrentView("creator")}
              onLike={handleLikeArtwork}
              onView={handleViewArtwork}
              isOwner={selectedGallery.ownerId === user.id}
            />
          )}

          {currentView === "creator" && (
            <CreatorPortal
              onNavigateToGallery={() => setCurrentView("gallery")}
              onAddArtwork={handleAddArtwork}
              artworks={artworks}
              maxArtworks={6}
            />
          )}

          {currentView === "checkout" && selectedArtwork && (
            <CheckoutPage
              artwork={selectedArtwork}
              onBack={() => setCurrentView("gallery")}
              onPurchase={(artwork) => {
                console.log("Purchase:", artwork)
                setCurrentView("gallery")
              }}
            />
          )}

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <GalleryUI
        gallery={selectedGallery}
        currentView={currentView}
        onBack={onBack}
        onNavigate={setCurrentView}
        user={user}
        artworkCount={artworks.length}
      />
    </div>
  )
}
