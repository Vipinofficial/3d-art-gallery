"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, LogOut, Palette, Users, TrendingUp } from "lucide-react"
import { dataStore, type Gallery } from "@/lib/data-store"

interface CreatorDashboardProps {
  user: any
  onBack: () => void
  onLogout: () => void
  onSuccess: (gallery: Gallery) => void
}

export function CreatorDashboard({ user, onBack, onLogout, onSuccess }: CreatorDashboardProps) {
  const [galleryData, setGalleryData] = useState({
    name: "",
    description: "",
  })
  const [isCreating, setIsCreating] = useState(false)
  const [stats, setStats] = useState({
    totalGalleries: 0,
    totalArtworks: 0,
    totalViews: 0,
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const galleries = await dataStore.getAllGalleries()
      const totalGalleries = galleries.length
      let totalArtworks = 0
      let totalViews = 0

      for (const gallery of galleries) {
        const artworks = await dataStore.getArtworksByGallery(gallery.id)
        totalArtworks += artworks.length
        totalViews += artworks.reduce((sum, artwork) => sum + artwork.views, 0)
      }

      setStats({ totalGalleries, totalArtworks, totalViews })
    } catch (error) {
      console.error("Failed to load stats:", error)
    }
  }

  const handleCreateGallery = async () => {
    if (!galleryData.name.trim() || !galleryData.description.trim()) {
      alert("Please fill in all fields")
      return
    }

    setIsCreating(true)
    try {
      const newGallery = await dataStore.createGallery({
        name: galleryData.name.trim(),
        owner: user.name,
        ownerId: user.id,
        description: galleryData.description.trim(),
        artworkCount: 0,
        totalViews: 0,
        totalLikes: 0,
        thumbnail: "/placeholder.svg?height=300&width=400&text=" + encodeURIComponent(galleryData.name),
        isPublic: true,
        hasAdultContent: false,
      })

      // Update user to mark as having a gallery
      await dataStore.updateUser(user.id, {
        hasGallery: true,
        galleryId: newGallery.id,
      })

      onSuccess(newGallery)
    } catch (error) {
      alert("Failed to create gallery. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Galleries</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Creator Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user.name}</span>
              <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2 bg-transparent">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <Palette className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-blue-900">Total Galleries</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.totalGalleries}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-green-900">Total Artworks</h3>
              <p className="text-2xl font-bold text-green-600">{stats.totalArtworks}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-purple-900">Total Views</h3>
              <p className="text-2xl font-bold text-purple-600">{stats.totalViews}</p>
            </CardContent>
          </Card>
        </div>

        {/* Create Gallery Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">Create Your Art Gallery</CardTitle>
            <CardDescription>Set up your personal space to showcase your digital art collection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Plus className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-indigo-900">What you'll get:</h4>
                  <ul className="text-sm text-indigo-800 mt-1 space-y-1">
                    <li>• Your own 3D virtual gallery space</li>
                    <li>• Upload up to 6 artworks</li>
                    <li>• File storage in /uploads/galleries/your-gallery-name/</li>
                    <li>• Analytics and visitor tracking</li>
                    <li>• Public gallery listing</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="gallery-name">Gallery Name *</Label>
                <Input
                  id="gallery-name"
                  value={galleryData.name}
                  onChange={(e) => setGalleryData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your gallery name"
                  maxLength={50}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will create a folder: /uploads/galleries/
                  {galleryData.name.toLowerCase().replace(/[^a-z0-9]/g, "-") || "your-gallery-name"}
                </p>
              </div>

              <div>
                <Label htmlFor="gallery-description">Description *</Label>
                <Textarea
                  id="gallery-description"
                  value={galleryData.description}
                  onChange={(e) => setGalleryData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your gallery and the type of art you'll showcase"
                  rows={4}
                  maxLength={500}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">{galleryData.description.length}/500 characters</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Gallery Features:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                    <span>3D Virtual Space</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                    <span>File Upload System</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                    <span>Visitor Analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                    <span>Public Listing</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCreateGallery}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
                disabled={isCreating || !galleryData.name.trim() || !galleryData.description.trim()}
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Gallery...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Gallery
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
