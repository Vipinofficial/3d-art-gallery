"use client"

import { useState, useEffect } from "react"
import { AuthProvider } from "@/components/auth-provider"
import { SecurityProvider } from "@/components/security-provider"
import { LandingPage } from "@/components/landing-page"
import { LoginForm } from "@/components/login-form"
import { GalleryList } from "@/components/gallery-list"
import { CreatorDashboard } from "@/components/creator-dashboard"
import { UploadArtwork } from "@/components/upload-artwork"
import { ArtGallery3D } from "@/components/art-gallery-3d"
import { LoadingScreen } from "@/components/loading-screen"
import { dataStore, type Gallery } from "@/lib/data-store"

type AppView = "landing" | "login" | "galleries" | "create-gallery" | "upload" | "gallery-3d"

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>("landing")
  const [user, setUser] = useState<any>(null)
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleLogin = async (userData: any) => {
    setUser(userData)

    // Check if user has a gallery
    const userGallery = await dataStore.getUserGallery(userData.id)
    if (userGallery) {
      setCurrentView("galleries")
    } else {
      setCurrentView("galleries") // Still show galleries page, they can create from there
    }
  }

  const handleLogout = () => {
    setUser(null)
    setSelectedGallery(null)
    setCurrentView("landing")
  }

  const handleSelectGallery = (gallery: Gallery) => {
    setSelectedGallery(gallery)
    setCurrentView("gallery-3d")
  }

  const handleCreateGallerySuccess = (gallery: Gallery) => {
    setSelectedGallery(gallery)
    setCurrentView("galleries")
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <SecurityProvider>
      <AuthProvider>
        <div className="min-h-screen">
          {currentView === "landing" && (
            <LandingPage
              onGetStarted={() => setCurrentView("login")}
              onExploreGalleries={() => setCurrentView("login")}
            />
          )}

          {currentView === "login" && <LoginForm onLogin={handleLogin} onBack={() => setCurrentView("landing")} />}

          {currentView === "galleries" && user && (
            <GalleryList
              user={user}
              onSelectGallery={handleSelectGallery}
              onCreateGallery={() => setCurrentView("create-gallery")}
              onUploadArtwork={() => setCurrentView("upload")}
              onBack={() => setCurrentView("landing")}
              onLogout={handleLogout}
            />
          )}

          {currentView === "create-gallery" && user && (
            <CreatorDashboard
              user={user}
              onBack={() => setCurrentView("galleries")}
              onLogout={handleLogout}
              onSuccess={handleCreateGallerySuccess}
            />
          )}

          {currentView === "upload" && user && (
            <UploadArtwork
              user={user}
              onBack={() => setCurrentView("galleries")}
              onLogout={handleLogout}
              onSuccess={() => setCurrentView("galleries")}
            />
          )}

          {currentView === "gallery-3d" && selectedGallery && user && (
            <ArtGallery3D selectedGallery={selectedGallery} onBack={() => setCurrentView("galleries")} user={user} />
          )}
        </div>
      </AuthProvider>
    </SecurityProvider>
  )
}
