"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BarChart3, Eye, Heart, TrendingUp, LogOut, Upload, AlertTriangle, Trash2 } from "lucide-react"
import { dataStore, type Artwork, type Gallery } from "@/lib/data-store"
import { DeleteConfirmation } from "@/components/delete-confirmation"

interface CreatorDashboardProps {
  user: any
  onBack: () => void
  onLogout: () => void
}

export function CreatorDashboard({ user, onBack, onLogout }: CreatorDashboardProps) {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [showDeleteArtwork, setShowDeleteArtwork] = useState(false)
  const [showDeleteGallery, setShowDeleteGallery] = useState(false)
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)

  useEffect(() => {
    loadData()
  }, [user.id])

  const loadData = () => {
    const userGallery = dataStore.getUserGallery(user.id)
    setGallery(userGallery || null)

    if (userGallery) {
      const galleryArtworks = dataStore.getArtworksByGallery(userGallery.id)
      setArtworks(galleryArtworks)
    }
  }

  const handleDeleteArtwork = async () => {
    if (!selectedArtwork) return

    const result = await dataStore.removeArtwork(selectedArtwork.id)
    if (result.success) {
      loadData() // Refresh data
      setSelectedArtwork(null)
      alert("Artwork deleted successfully!")
    } else {
      alert(result.error || "Failed to delete artwork")
    }
  }

  const handleDeleteGallery = async () => {
    if (!gallery) return

    const result = await dataStore.deleteGallery(gallery.id)
    if (result.success) {
      alert("Gallery and all its contents have been permanently deleted!")
      onBack() // Go back to galleries list
    } else {
      alert(result.error || "Failed to delete gallery")
    }
  }

  const openDeleteArtwork = (artwork: Artwork) => {
    setSelectedArtwork(artwork)
    setShowDeleteArtwork(true)
  }

  if (!gallery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Gallery Found</h2>
            <p className="text-gray-600 mb-6">You need to create a gallery before accessing the dashboard.</p>
            <Button onClick={onBack} className="w-full">
              Go Back to Galleries
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalViews = artworks.reduce((sum, art) => sum + art.views, 0)
  const totalLikes = artworks.reduce((sum, art) => sum + art.likes, 0)
  const totalSales = artworks.reduce((sum, art) => sum + art.sales, 0)
  const totalRevenue = artworks.reduce((sum, art) => sum + art.price * art.sales, 0)

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gallery Info */}
        <Card className="mb-8 border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{gallery.name}</h2>
                <p className="text-gray-600">{gallery.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="secondary">{artworks.length}/6 artworks</Badge>
                  <Badge variant="outline" className="text-xs">
                    Folder: /uploads/galleries/{gallery.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}
                  </Badge>
                  <span className="text-sm text-gray-500">{gallery.totalViews} total views</span>
                  {gallery.hasAdultContent && (
                    <Badge variant="destructive" className="bg-orange-500">
                      Adult Content
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteGallery(true)}
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Gallery</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="portfolio" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Total Artworks</h3>
                  <p className="text-2xl font-bold text-blue-600">{artworks.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Total Views</h3>
                  <p className="text-2xl font-bold text-green-600">{totalViews}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Total Likes</h3>
                  <p className="text-2xl font-bold text-red-600">{totalLikes}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Available Slots</h3>
                  <p className="text-2xl font-bold text-purple-600">{6 - artworks.length}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Artworks</CardTitle>
                <CardDescription>Manage your uploaded artworks</CardDescription>
              </CardHeader>
              <CardContent>
                {artworks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {artworks.map((artwork) => (
                      <Card key={artwork.id} className="group">
                        <div className="aspect-square overflow-hidden rounded-t-lg relative">
                          <img
                            src={artwork.image || "/placeholder.svg"}
                            alt={artwork.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {artwork.hasAdultContent && (
                            <div className="absolute top-2 left-2">
                              <Badge variant="destructive" className="bg-orange-500">
                                18+
                              </Badge>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900 truncate">{artwork.title}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteArtwork(artwork)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">${artwork.price}</p>
                          <div className="flex justify-between text-xs text-gray-500 mb-2">
                            <span>{artwork.views} views</span>
                            <span>{artwork.likes} likes</span>
                            <span>{artwork.sales} sales</span>
                          </div>
                          {artwork.fileName && (
                            <p className="text-xs text-blue-600 truncate">File: {artwork.fileName}</p>
                          )}
                          {artwork.hasAdultContent && (
                            <div className="flex items-center space-x-1 mt-2 text-orange-600">
                              <AlertTriangle className="w-3 h-3" />
                              <span className="text-xs">Adult content</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No artworks uploaded yet</p>
                    <p className="text-sm text-gray-400">Upload your first artwork to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-blue-900">Total Views</h3>
                  <p className="text-3xl font-bold text-blue-600">{totalViews}</p>
                  <p className="text-sm text-gray-500 mt-1">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-green-900">Total Likes</h3>
                  <p className="text-3xl font-bold text-green-600">{totalLikes}</p>
                  <p className="text-sm text-gray-500 mt-1">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-purple-900">Total Sales</h3>
                  <p className="text-3xl font-bold text-purple-600">{totalSales}</p>
                  <p className="text-sm text-gray-500 mt-1">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-orange-900">Revenue</h3>
                  <p className="text-3xl font-bold text-orange-600">${totalRevenue}</p>
                  <p className="text-sm text-gray-500 mt-1">All time</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Artwork</CardTitle>
                </CardHeader>
                <CardContent>
                  {artworks.length > 0 ? (
                    <div className="space-y-4">
                      {artworks
                        .sort((a, b) => b.views + b.likes - (a.views + a.likes))
                        .slice(0, 3)
                        .map((artwork, index) => (
                          <div key={artwork.id} className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-indigo-600">{index + 1}</span>
                            </div>
                            <img
                              src={artwork.image || "/placeholder.svg"}
                              alt={artwork.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{artwork.title}</p>
                              <p className="text-sm text-gray-600">
                                {artwork.views} views • {artwork.likes} likes
                              </p>
                            </div>
                            <Badge variant="secondary">${artwork.price}</Badge>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No data available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Views per Artwork</span>
                      <span className="font-semibold">
                        {artworks.length > 0 ? Math.round(totalViews / artworks.length) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Likes per Artwork</span>
                      <span className="font-semibold">
                        {artworks.length > 0 ? Math.round(totalLikes / artworks.length) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Price</span>
                      <span className="font-semibold">
                        $
                        {artworks.length > 0
                          ? Math.round(artworks.reduce((sum, art) => sum + art.price, 0) / artworks.length)
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Conversion Rate</span>
                      <span className="font-semibold">
                        {totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Artwork Confirmation */}
      <DeleteConfirmation
        isOpen={showDeleteArtwork}
        onClose={() => {
          setShowDeleteArtwork(false)
          setSelectedArtwork(null)
        }}
        onConfirm={handleDeleteArtwork}
        itemName={selectedArtwork?.title || ""}
        itemType="artwork"
        warningMessage="This will permanently delete the artwork and its associated file."
      />

      {/* Delete Gallery Confirmation */}
      <DeleteConfirmation
        isOpen={showDeleteGallery}
        onClose={() => setShowDeleteGallery(false)}
        onConfirm={handleDeleteGallery}
        itemName={gallery.name}
        itemType="gallery"
        warningMessage="This action will delete the entire gallery folder and cannot be undone."
      />
    </div>
  )
}
