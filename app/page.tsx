"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { AuthProvider } from "@/components/auth-provider"
import { LoginForm } from "@/components/login-form"
import { GalleryList } from "@/components/gallery-list"
import { ArtGallery3D } from "@/components/art-gallery-3d"
import { CreatorDashboard } from "@/components/creator-dashboard"
import { UploadArtwork } from "@/components/upload-artwork"
import { CheckoutPage } from "@/components/checkout-page"
import { SecurityProvider } from "@/components/security-provider"

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [currentView, setCurrentView] = useState<
    "landing" | "login" | "galleries" | "gallery" | "dashboard" | "upload" | "checkout"
  >("landing")
  const [selectedGallery, setSelectedGallery] = useState<any>(null)
  const [checkoutItems, setCheckoutItems] = useState<any[]>([])
  const [showLogin, setShowLogin] = useState(false)

  const handleLogin = (userData: any) => {
    setUser(userData)
    setCurrentView("galleries")
    setShowLogin(false)
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentView("landing")
    setSelectedGallery(null)
  }

  const handleSelectGallery = (gallery: any) => {
    setSelectedGallery(gallery)
    setCurrentView("gallery")
  }

  const handleCheckout = (items: any[]) => {
    setCheckoutItems(items)
    setCurrentView("checkout")
  }

  const handleShowLogin = () => {
    setShowLogin(true)
    setCurrentView("login")
  }

  return (
    <SecurityProvider>
      <AuthProvider>
        <div className="w-full h-screen">
          {currentView === "landing" && <LandingPage onLogin={handleShowLogin} onSignup={handleShowLogin} />}

          {(currentView === "login" || showLogin) && (
            <LoginForm onLogin={handleLogin} onBack={() => setCurrentView("landing")} />
          )}

          {currentView === "galleries" && user && (
            <GalleryList
              user={user}
              onSelectGallery={handleSelectGallery}
              onLogout={handleLogout}
              onOpenDashboard={() => setCurrentView("dashboard")}
              onOpenUpload={() => setCurrentView("upload")}
            />
          )}

          {currentView === "gallery" && selectedGallery && user && (
            <ArtGallery3D
              user={user}
              gallery={selectedGallery}
              onBackToGalleries={() => setCurrentView("galleries")}
              onCheckout={handleCheckout}
              onLogout={handleLogout}
              onOpenDashboard={() => setCurrentView("dashboard")}
            />
          )}

          {currentView === "dashboard" && user && (
            <CreatorDashboard user={user} onBack={() => setCurrentView("galleries")} onLogout={handleLogout} />
          )}

          {currentView === "upload" && user && (
            <UploadArtwork
              user={user}
              onBack={() => setCurrentView("galleries")}
              onLogout={handleLogout}
              onSuccess={() => setCurrentView("galleries")}
            />
          )}

          {currentView === "checkout" && user && (
            <CheckoutPage
              items={checkoutItems}
              user={user}
              onBack={() => setCurrentView("gallery")}
              onComplete={() => setCurrentView("galleries")}
            />
          )}
        </div>
      </AuthProvider>
    </SecurityProvider>
  )
}
