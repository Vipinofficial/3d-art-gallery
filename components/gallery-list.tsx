"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  Plus,
  Eye,
  Heart,
  Users,
  Calendar,
  ArrowLeft,
  LogOut,
  Upload,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { dataStore, type Gallery } from "@/lib/data-store"
import { fileSystem } from "@/lib/file-system"
import { DeleteConfirmation } from "@/components/delete-confirmation"

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
  const [deleteGallery, setDeleteGallery] = useState<Gallery | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadGalleries()
  }, [user.id])

  const loadGalleries = async () => {
    try {
      const allGalleries = await dataStore.getAllGalleries()
      const myGallery = await dataStore.getUserGallery(user.id)

      setGalleries(allGalleries)
      setUserGallery(myGallery || null)
    } catch (error) {
      console.error("Failed to load galleries:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGallery = async (gallery: Gallery) => {
    if (!gallery) return

    setIsDeleting(true)
    try {
      // Delete gallery folder and files
      const folderDeletion = await fileSystem.deleteGalleryFolder(gallery.id, gallery.name)
      if (!folderDeletion.success) {
        console.warn("Failed to delete gallery folder:", folderDeletion.error)
      }

      // Delete gallery from data store
      const result = await dataStore.deleteGallery(gallery.id)
      if (result.success) {
        await loadGalleries() // Reload galleries
        setDeleteGallery(null)
      } else {
        alert(result.error || "Failed to delete gallery")
      }
    } catch (error) {
      alert("Failed to delete gallery")
    } finally {
      setIsDeleting(false)
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
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-indigo-900">Your Gallery</CardTitle>
                  <CardDescription>Manage your personal art collection</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={onUploadArtwork} className="bg-indigo-600 hover:bg-indigo-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Art
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteGallery(userGallery)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={userGallery.thumbnail || "/placeholder.svg"}
                    alt={userGallery.name}
                    className="w-16 h-16 object-cover rounded-lg border-2 border-indigo-200"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{userGallery.name}</h3>
                    <p className="text-gray-600 text-sm">{userGallery.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                        {userGallery.artworkCount} artworks
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Created {new Date(userGallery.createdAt).toLocaleDateString()}
                      </Badge>
                      {userGallery.hasAdultContent && (
                        <Badge variant="destructive" className="bg-orange-500">
                          18+
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => onSelectGallery(userGallery)}
                  variant="outline"
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Gallery
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 border-2 border-dashed border-gray-300 bg-gray-50">
            <CardContent className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Your Gallery</h3>
                <p className="text-gray-600 mb-4">
                  You don't have a gallery yet. Create one to start showcasing your digital art collection.
                </p>
                <Button onClick={onCreateGallery} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Gallery
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search galleries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200"
            />
          </div>
        </div>

        {/* Galleries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleries.map((gallery) => (
            <Card
              key={gallery.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              onClick={() => onSelectGallery(gallery)}
            >
              <div className="relative">
                <img
                  src={gallery.thumbnail || "/placeholder.svg"}
                  alt={gallery.name}
                  className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                />
                {gallery.hasAdultContent && (
                  <Badge variant="destructive" className="absolute top-2 right-2 bg-orange-500">
                    18+
                  </Badge>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-t-lg" />
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {gallery.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="text-xs bg-indigo-100 text-indigo-600">
                          {gallery.owner.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">{gallery.owner}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{gallery.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{gallery.artworkCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{gallery.totalViews}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{gallery.totalLikes}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(gallery.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGalleries.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No galleries found</h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms" : "No galleries available at the moment"}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={!!deleteGallery}
        onClose={() => setDeleteGallery(null)}
        onConfirm={() => deleteGallery && handleDeleteGallery(deleteGallery)}
        title="Delete Gallery"
        description={
          deleteGallery ? (
            <div className="space-y-3">
              <p>
                Are you sure you want to delete <strong>"{deleteGallery.name}"</strong>?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium">This action will permanently:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Delete all {deleteGallery.artworkCount} artworks in this gallery</li>
                      <li>
                        Remove the gallery folder: /uploads/galleries/
                        {deleteGallery.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}
                      </li>
                      <li>Delete all uploaded image files</li>
                      <li>Remove all gallery data and statistics</li>
                    </ul>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">This action cannot be undone.</p>
            </div>
          ) : (
            ""
          )
        }
        confirmText="Delete Gallery"
        isLoading={isDeleting}
      />
    </div>
  )
}
