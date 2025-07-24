"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, LogOut, Palette, Settings, Search, Upload, AlertTriangle, Trash2 } from "lucide-react"
import { dataStore, type Gallery } from "@/lib/data-store"
import { TermsConditions } from "@/components/terms-conditions"
import { DeleteConfirmation } from "@/components/delete-confirmation"

interface GalleryListProps {
  user: any
  onSelectGallery: (gallery: any) => void
  onLogout: () => void
  onOpenDashboard: () => void
  onOpenUpload: () => void
}

export function GalleryList({ user, onSelectGallery, onLogout, onOpenDashboard, onOpenUpload }: GalleryListProps) {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newGalleryName, setNewGalleryName] = useState("")
  const [newGalleryDescription, setNewGalleryDescription] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showTerms, setShowTerms] = useState(false)
  const [selectedGalleryForTerms, setSelectedGalleryForTerms] = useState<Gallery | null>(null)
  const [showDeleteGallery, setShowDeleteGallery] = useState(false)

  useEffect(() => {
    loadGalleries()
  }, [])

  const loadGalleries = () => {
    const allGalleries = dataStore.getAllGalleries()
    setGalleries(allGalleries)
  }

  const userGallery = galleries.find((g) => g.ownerId === user.id)
  const filteredGalleries = galleries.filter(
    (gallery) =>
      gallery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gallery.owner.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateGallery = () => {
    if (newGalleryName.trim()) {
      const newGallery = dataStore.createGallery({
        name: newGalleryName.trim(),
        owner: user.name,
        ownerId: user.id,
        description: newGalleryDescription.trim() || "A new art gallery",
        artworkCount: 0,
        totalViews: 0,
        totalLikes: 0,
        thumbnail: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(newGalleryName)}`,
        isPublic: true,
        hasAdultContent: false,
      })

      // Update user to have gallery
      dataStore.updateUser(user.id, { hasGallery: true, galleryId: newGallery.id })

      setNewGalleryName("")
      setNewGalleryDescription("")
      setShowCreateForm(false)
      loadGalleries()
    }
  }

  const handleDeleteGallery = async () => {
    if (!userGallery) return

    const result = await dataStore.deleteGallery(userGallery.id)
    if (result.success) {
      // Update user to remove gallery reference
      dataStore.updateUser(user.id, { hasGallery: false, galleryId: undefined })
      loadGalleries()
      alert("Gallery and all its contents have been permanently deleted!")
    } else {
      alert(result.error || "Failed to delete gallery")
    }
  }

  const handleGallerySelect = (gallery: Gallery) => {
    // Check if gallery has adult content and show terms if needed
    if (gallery.hasAdultContent && gallery.ownerId !== user.id) {
      setSelectedGalleryForTerms(gallery)
      setShowTerms(true)
    } else {
      onSelectGallery(gallery)
    }
  }

  const handleTermsAccept = (acceptedTerms: boolean, acceptedAdult: boolean) => {
    if (selectedGalleryForTerms && acceptedTerms && acceptedAdult) {
      onSelectGallery(selectedGalleryForTerms)
      setSelectedGalleryForTerms(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Palette className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ArtVerse Galleries
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.name}</span>
              {userGallery && (
                <>
                  <Button
                    variant="outline"
                    onClick={onOpenUpload}
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Art</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onOpenDashboard}
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2 bg-transparent">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Create Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search galleries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {!userGallery && (
              <div className="flex items-center space-x-2">
                {showCreateForm ? (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Gallery name..."
                        value={newGalleryName}
                        onChange={(e) => setNewGalleryName(e.target.value)}
                        className="w-48"
                      />
                      <Button onClick={handleCreateGallery} disabled={!newGalleryName.trim()}>
                        Create
                      </Button>
                      <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                        Cancel
                      </Button>
                    </div>
                    <Input
                      placeholder="Gallery description (optional)..."
                      value={newGalleryDescription}
                      onChange={(e) => setNewGalleryDescription(e.target.value)}
                      className="w-full"
                    />
                  </div>
                ) : (
                  <Button onClick={() => setShowCreateForm(true)} className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create Your Gallery</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Your Gallery Section */}
        {userGallery && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Gallery</h2>
            <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={userGallery.thumbnail || "/placeholder.svg"}
                      alt={userGallery.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{userGallery.name}</h3>
                      <p className="text-gray-600">{userGallery.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="secondary">{userGallery.artworkCount}/6 artworks</Badge>
                        <Badge variant="outline" className="text-xs">
                          /uploads/galleries/{userGallery.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}
                        </Badge>
                        <span className="text-sm text-gray-500">{userGallery.totalViews} views</span>
                        {userGallery.hasAdultContent && (
                          <Badge variant="destructive" className="bg-orange-500">
                            18+
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={onOpenUpload}
                      className="flex items-center space-x-2 bg-transparent"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onOpenDashboard}
                      className="flex items-center space-x-2 bg-transparent"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Manage</span>
                    </Button>
                    <Button onClick={() => onSelectGallery(userGallery)} className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>View 3D</span>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteGallery(true)}
                      className="flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* All Galleries Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Explore Galleries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGalleries.map((gallery) => (
              <Card
                key={gallery.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
              >
                <div className="aspect-video overflow-hidden rounded-t-lg relative">
                  <img
                    src={gallery.thumbnail || "/placeholder.svg"}
                    alt={gallery.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {gallery.hasAdultContent && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="destructive" className="bg-orange-500">
                        18+
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{gallery.name}</CardTitle>
                    <Badge variant={gallery.artworkCount === 6 ? "default" : "secondary"}>
                      {gallery.artworkCount}/6
                    </Badge>
                  </div>
                  <CardDescription>by {gallery.owner}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{gallery.description}</p>
                  {gallery.hasAdultContent && (
                    <div className="flex items-center space-x-2 mb-3 p-2 bg-orange-50 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-orange-800">Contains adult content</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{gallery.totalViews} views</span>
                    <Button
                      onClick={() => handleGallerySelect(gallery)}
                      variant="outline"
                      className="flex items-center space-x-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Visit 3D</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredGalleries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No galleries found matching your search.</p>
          </div>
        )}
      </div>

      {/* Terms and Conditions Modal for Adult Content */}
      <TermsConditions
        isOpen={showTerms}
        onClose={() => {
          setShowTerms(false)
          setSelectedGalleryForTerms(null)
        }}
        onAccept={handleTermsAccept}
        showAdultContent={selectedGalleryForTerms?.hasAdultContent || false}
      />

      {/* Delete Gallery Confirmation */}
      <DeleteConfirmation
        isOpen={showDeleteGallery}
        onClose={() => setShowDeleteGallery(false)}
        onConfirm={handleDeleteGallery}
        itemName={userGallery?.name || ""}
        itemType="gallery"
        warningMessage="This action will delete the entire gallery folder and all its contents permanently."
      />
    </div>
  )
}
