"use client"

import { useState, useEffect } from "react"
import { AuthProvider } from "@/components/auth-provider"
import { SecurityProvider } from "@/components/security-provider"
import { LandingPage } from "@/components/landing-page"
import { GalleryList } from "@/components/gallery-list"
import { ArtGallery3D } from "@/components/art-gallery-3d"
import { CreatorPortal } from "@/components/creator-portal"
import { CheckoutPage } from "@/components/checkout-page"
import { LoadingScreen } from "@/components/loading-screen"

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "galleries" | "gallery" | "creator" | "checkout">(
    "landing",
  )
  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null)
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize the app
    const initializeApp = async () => {
      try {
        // Give the data store time to initialize
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to initialize app:", error)
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  const handleViewGalleries = () => {
    setCurrentView("galleries")
  }

  const handleViewGallery = (galleryId: string) => {
    setSelectedGalleryId(galleryId)
    setCurrentView("gallery")
  }

  const handleBackToGalleries = () => {
    setSelectedGalleryId(null)
    setCurrentView("galleries")
  }

  const handleBackToLanding = () => {
    setCurrentView("landing")
  }

  const handleOpenCreator = () => {
    setCurrentView("creator")
  }

  const handlePurchaseArtwork = (artworkId: string) => {
    setSelectedArtworkId(artworkId)
    setCurrentView("checkout")
  }

  const handleBackFromCheckout = () => {
    setSelectedArtworkId(null)
    if (selectedGalleryId) {
      setCurrentView("gallery")
    } else {
      setCurrentView("galleries")
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <AuthProvider>
      <SecurityProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          {currentView === "landing" && (
            <LandingPage onViewGalleries={handleViewGalleries} onOpenCreator={handleOpenCreator} />
          )}

          {currentView === "galleries" && (
            <GalleryList
              onViewGallery={handleViewGallery}
              onBackToLanding={handleBackToLanding}
              onOpenCreator={handleOpenCreator}
            />
          )}

          {currentView === "gallery" && selectedGalleryId && (
            <ArtGallery3D
              galleryId={selectedGalleryId}
              onBack={handleBackToGalleries}
              onPurchase={handlePurchaseArtwork}
            />
          )}

          {currentView === "creator" && (
            <CreatorPortal onBack={currentView === "galleries" ? handleBackToGalleries : handleBackToLanding} />
          )}

          {currentView === "checkout" && selectedArtworkId && (
            <CheckoutPage artworkId={selectedArtworkId} onBack={handleBackFromCheckout} />
          )}
        </div>
      </SecurityProvider>
    </AuthProvider>
  )
}
