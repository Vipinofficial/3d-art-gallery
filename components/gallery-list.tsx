"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Eye, Heart, Plus, Upload, LogOut, Palette } from "lucide-react"
import { dataStore, type Gallery } from "@/lib/data-store"

interface GalleryListProps {
  user: any
  onSelectGallery: (gallery: Gallery) => void
  onCreateGallery: () => void
  onUploadArtwork: () => void
  onBack: () => void
  onLogout: () => void
}

export function GalleryList({
  user,
  onSelectGallery,
  onCreateGallery,
  onUploadArtwork,
  onBack,
  onLogout,
}: GalleryListProps) {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [userGallery, setUserGallery] = useState<Gallery | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGalleries()
  }, [user.id])

  const loadGalleries = async () => {
    try {
      const allGalleries = await dataStore.getAllGalleries()
      setGalleries(allGalleries)

      const userGal = await dataStore.getUserGallery(user.id)
      setUserGallery(userGal || null)
    } catch (error) {
      console.error("Failed to load galleries:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGalleries = galleries.filter(
    (gallery) =>
      gallery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gallery.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gallery.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
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
                <span>Back</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Art Galleries</h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Gallery Section */}
        {userGallery ? (
          <Card className="mb-8 border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Your Gallery: {userGallery.name}</h2>
                  <p className="text-gray-600">{userGallery.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary">{userGallery.artworkCount}/6 artworks</Badge>
                    <span className="text-sm text-gray-500">{userGallery.totalViews} views</span>
                    <span className="text-sm text-gray-500">{userGallery.totalLikes} likes</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={onUploadArtwork} className="flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload Art</span>
                  </Button>
                  <Button variant="outline" onClick={() => onSelectGallery(userGallery)}>
                    View Gallery
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 border-2 border-dashed border-gray-300 bg-gray-50">
            <CardContent className="p-6 text-center">
              <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Create Your Gallery</h2>
              <p className="text-gray-600 mb-4">
                You don't have a gallery yet. Create one to start showcasing your art!
              </p>
              <Button onClick={onCreateGallery} className="flex items-center space-x-2 mx-auto">
                <Plus className="w-4 h-4" />
                <span>Create Gallery</span>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search galleries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Galleries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleries.map((gallery) => (
            <Card
              key={gallery.id}
              className="group hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onSelectGallery(gallery)}
            >
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={gallery.thumbnail || "/placeholder.svg"}
                  alt={gallery.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{gallery.name}</CardTitle>
                    <CardDescription>by {gallery.owner}</CardDescription>
                  </div>
                  {gallery.hasAdultContent && (
                    <Badge variant="destructive" className="bg-orange-500">
                      18+
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{gallery.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{gallery.totalViews}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{gallery.totalLikes}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{gallery.artworkCount} artworks</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGalleries.length === 0 && (
          <div className="text-center py-12">
            <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No galleries found</p>
            {searchTerm && <p className="text-sm text-gray-400">Try adjusting your search terms</p>}
          </div>
        )}
      </div>
    </div>
  )
}
