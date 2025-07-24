"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Html, Box, Plane } from "@react-three/drei"
import { FloatingLabel } from "./floating-label"
import { Upload, BarChart3, DollarSign, ImageIcon, Link, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

interface CreatorPortalProps {
  onNavigateToGallery: () => void
  onAddArtwork: (artwork: any) => void
  artworks: any[]
  maxArtworks: number
}

export function CreatorPortal({ onNavigateToGallery, onAddArtwork, artworks, maxArtworks }: CreatorPortalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "portfolio" | "analytics">("upload")
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file")
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleUrlChange = (url: string) => {
    setUploadData((prev) => ({ ...prev, imageUrl: url }))
    setPreviewUrl(url)
  }

  const handleUpload = () => {
    if (artworks.length >= maxArtworks) {
      alert(`Gallery is full! Maximum ${maxArtworks} artworks allowed.`)
      return
    }

    const imageSource = uploadMethod === "file" ? previewUrl : uploadData.imageUrl

    if (!imageSource || !uploadData.title || !uploadData.price) {
      alert("Please fill in all required fields and select an image.")
      return
    }

    const newArtwork = {
      title: uploadData.title,
      description: uploadData.description,
      price: Number.parseFloat(uploadData.price),
      category: uploadData.category,
      image: imageSource,
    }

    onAddArtwork(newArtwork)

    // Reset form
    setUploadData({
      title: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
    })
    setSelectedFile(null)
    setPreviewUrl("")

    alert("Artwork uploaded successfully!")
  }

  const clearImage = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    setUploadData((prev) => ({ ...prev, imageUrl: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <group>
      {/* Creator Portal Floor */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.8} />
      </Plane>

      {/* Portal Walls */}
      <Plane args={[20, 10]} position={[0, 5, -10]} castShadow receiveShadow>
        <meshStandardMaterial color="#f8f9fa" />
      </Plane>

      {/* Main Creator Kiosk */}
      <group position={[0, 0, -2]}>
        <Box args={[8, 5, 0.3]} position={[0, 2.5, 0]} castShadow>
          <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
        </Box>

        {/* Interactive Dashboard */}
        <Html position={[0, 2.5, 0.2]} center distanceFactor={5} style={{ pointerEvents: "auto" }}>
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-[600px] max-h-[600px] overflow-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Creator Portal</h2>
              <p className="text-gray-600">
                Manage your digital art collection ({artworks.length}/{maxArtworks} slots used)
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "upload" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Upload Art
              </button>
              <button
                onClick={() => setActiveTab("portfolio")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "portfolio" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Portfolio
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "analytics" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <DollarSign className="w-4 h-4 inline mr-2" />
                Analytics
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "upload" && (
              <div className="space-y-4">
                {artworks.length >= maxArtworks && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">
                      Gallery is full! You can only have {maxArtworks} artworks in your gallery.
                    </p>
                  </div>
                )}

                {/* Upload Method Selection */}
                <div className="flex space-x-2 mb-4">
                  <Button
                    variant={uploadMethod === "file" ? "default" : "outline"}
                    onClick={() => setUploadMethod("file")}
                    className="flex items-center space-x-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Upload File</span>
                  </Button>
                  <Button
                    variant={uploadMethod === "url" ? "default" : "outline"}
                    onClick={() => setUploadMethod("url")}
                    className="flex items-center space-x-2"
                  >
                    <Link className="w-4 h-4" />
                    <span>Image URL</span>
                  </Button>
                </div>

                {/* Image Upload/URL Section */}
                <div className="space-y-4">
                  {uploadMethod === "file" ? (
                    <div>
                      <Label htmlFor="file-upload">Upload Image</Label>
                      <input
                        ref={fileInputRef}
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="image-url">Image URL</Label>
                      <Input
                        id="image-url"
                        type="url"
                        value={uploadData.imageUrl}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  )}

                  {/* Image Preview */}
                  {previewUrl && (
                    <div className="relative">
                      <Label>Preview</Label>
                      <div className="relative mt-1">
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <Button variant="destructive" size="sm" onClick={clearImage} className="absolute top-2 right-2">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="title">Artwork Title *</Label>
                  <Input
                    id="title"
                    value={uploadData.title}
                    onChange={(e) => setUploadData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter artwork title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={uploadData.description}
                    onChange={(e) => setUploadData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your artwork"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={uploadData.price}
                      onChange={(e) => setUploadData((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={uploadData.category}
                      onChange={(e) => setUploadData((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="Digital Art"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleUpload}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={artworks.length >= maxArtworks}
                >
                  Upload Artwork ({artworks.length}/{maxArtworks})
                </Button>
              </div>
            )}

            {activeTab === "portfolio" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900">Total Artworks</h3>
                      <p className="text-2xl font-bold text-indigo-600">{artworks.length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900">Available Slots</h3>
                      <p className="text-2xl font-bold text-green-600">{maxArtworks - artworks.length}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Your Artworks</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {artworks.length > 0 ? (
                      artworks.map((artwork, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <img
                              src={artwork.image || "/placeholder.svg"}
                              alt={artwork.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <span className="text-sm font-medium">{artwork.title}</span>
                              <p className="text-xs text-gray-500">${artwork.price}</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{artwork.likes || 0} likes</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No artworks uploaded yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold text-blue-900">Total Views</h3>
                      <p className="text-xl font-bold text-blue-600">
                        {artworks.reduce((sum, art) => sum + (art.views || 0), 0)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold text-green-900">Total Likes</h3>
                      <p className="text-xl font-bold text-green-600">
                        {artworks.reduce((sum, art) => sum + (art.likes || 0), 0)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold text-purple-900">Avg. Price</h3>
                      <p className="text-xl font-bold text-purple-600">
                        $
                        {artworks.length > 0
                          ? (artworks.reduce((sum, art) => sum + art.price, 0) / artworks.length).toFixed(0)
                          : 0}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {artworks.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Top Performing Artwork</h3>
                      <div className="flex items-center space-x-3">
                        <img
                          src={artworks[0].image || "/placeholder.svg"}
                          alt={artworks[0].title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{artworks[0].title}</p>
                          <p className="text-sm text-gray-600">{artworks[0].likes || 0} likes</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </Html>
      </group>

      {/* Floating Labels */}
      <FloatingLabel text="Upload Art" position={[-4, 4, -1]} color="#10b981" />
      <FloatingLabel text="Your Portfolio" position={[4, 4, -1]} color="#6366f1" />
      <FloatingLabel text="Back to Gallery" position={[0, 6, 2]} color="#f59e0b" onClick={onNavigateToGallery} />

      {/* Navigation Path back to Gallery */}
      <group position={[0, 0.1, 6]}>
        <Box args={[3, 0.1, 0.8]} castShadow>
          <meshStandardMaterial color="#333333" emissive="#111111" />
        </Box>
        <Html position={[0, 0.2, 0]} center>
          <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg border border-gray-700">
            <span className="text-sm font-medium text-white">← Back to Gallery</span>
          </div>
        </Html>
      </group>
    </group>
  )
}
