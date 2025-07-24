"use client"

import React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, Link, X, ImageIcon, AlertTriangle, LogOut } from "lucide-react"
import { useSecurity } from "@/components/security-provider"
import { dataStore } from "@/lib/data-store"
import { fileSystem } from "@/lib/file-system"
import { TermsConditions } from "@/components/terms-conditions"

interface UploadArtworkProps {
  user: any
  onBack: () => void
  onLogout: () => void
  onSuccess: () => void
}

export function UploadArtwork({ user, onBack, onLogout, onSuccess }: UploadArtworkProps) {
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
  const [hasAdultContent, setHasAdultContent] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [userGallery, setUserGallery] = useState<any>(null)
  const [galleryArtworks, setGalleryArtworks] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { sanitizeInput } = useSecurity()

  const maxArtworks = 6

  // Load user gallery and artworks
  React.useEffect(() => {
    const loadGalleryData = async () => {
      const gallery = await dataStore.getUserGallery(user.id)
      setUserGallery(gallery)

      if (gallery) {
        const artworks = await dataStore.getArtworksByGallery(gallery.id)
        setGalleryArtworks(artworks)
      }
    }

    loadGalleryData()
  }, [user.id])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validation = fileSystem.validateFile(file)
      if (!validation.isValid) {
        alert(validation.error)
        return
      }

      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleUrlChange = (url: string) => {
    const sanitizedUrl = sanitizeInput(url)
    setUploadData((prev) => ({ ...prev, imageUrl: sanitizedUrl }))
    setPreviewUrl(sanitizedUrl)
  }

  const handleUpload = async () => {
    if (!acceptedTerms) {
      setShowTerms(true)
      return
    }

    if (!userGallery) {
      alert("You need to create a gallery first!")
      return
    }

    if (galleryArtworks.length >= maxArtworks) {
      alert(`Gallery is full! Maximum ${maxArtworks} artworks allowed.`)
      return
    }

    const imageSource = uploadMethod === "file" ? previewUrl : uploadData.imageUrl

    if (!imageSource || !uploadData.title || !uploadData.price) {
      alert("Please fill in all required fields and select an image.")
      return
    }

    // Sanitize all inputs
    const sanitizedData = {
      title: sanitizeInput(uploadData.title),
      description: sanitizeInput(uploadData.description),
      category: sanitizeInput(uploadData.category),
      price: Number.parseFloat(uploadData.price),
    }

    if (sanitizedData.price <= 0 || sanitizedData.price > 10000) {
      alert("Price must be between $0.01 and $10,000")
      return
    }

    setIsUploading(true)

    try {
      let finalImageUrl = ""
      let fileName = ""

      if (uploadMethod === "file" && selectedFile) {
        // Upload file to server
        const uploadResult = await fileSystem.uploadFile(selectedFile, userGallery.name, userGallery.id)

        if (!uploadResult.success) {
          alert(uploadResult.error || "Upload failed")
          return
        }

        finalImageUrl = uploadResult.filePath || ""
        fileName = uploadResult.fileName || ""
      } else {
        // Use provided URL
        finalImageUrl = sanitizedData.imageUrl || imageSource
      }

      const newArtwork = {
        title: sanitizedData.title,
        artist: user.name,
        artistId: user.id,
        price: sanitizedData.price,
        image: finalImageUrl,
        description: sanitizedData.description,
        category: sanitizedData.category,
        likes: 0,
        views: 0,
        sales: 0,
        hasAdultContent,
        galleryId: userGallery.id,
        fileName: uploadMethod === "file" ? fileName : undefined,
      }

      await dataStore.addArtwork(newArtwork)

      // Update gallery adult content flag if needed
      if (hasAdultContent && !userGallery.hasAdultContent) {
        await dataStore.updateGallery(userGallery.id, { hasAdultContent: true })
      }

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
      setHasAdultContent(false)

      alert("Artwork uploaded successfully!")
      onSuccess()
    } catch (error) {
      alert("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const clearImage = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    setUploadData((prev) => ({ ...prev, imageUrl: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleTermsAccept = (terms: boolean, adult: boolean) => {
    setAcceptedTerms(terms)
  }

  if (!userGallery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Gallery Found</h2>
            <p className="text-gray-600 mb-6">You need to create a gallery before uploading artwork.</p>
            <Button onClick={onBack} className="w-full">
              Go Back to Galleries
            </Button>
          </CardContent>
        </Card>
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
                <span>Back to Galleries</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Upload Artwork</h1>
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
        {/* Gallery Info */}
        <Card className="mb-8 border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{userGallery.name}</h2>
                <p className="text-gray-600">{userGallery.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="secondary">
                    {galleryArtworks.length}/{maxArtworks} artworks
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Folder: /uploads/galleries/{userGallery.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}
                  </Badge>
                  {userGallery.hasAdultContent && (
                    <Badge variant="destructive" className="bg-orange-500">
                      Adult Content
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Upload New Artwork</CardTitle>
            <CardDescription>
              Add new artwork to your gallery ({galleryArtworks.length}/{maxArtworks} slots used)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {galleryArtworks.length >= maxArtworks && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">
                  Gallery is full! You can only have {maxArtworks} artworks in your gallery.
                </p>
              </div>
            )}

            {/* Upload Method Selection */}
            <div className="flex space-x-2">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: JPEG, PNG, GIF, WebP. Max size: 10MB
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Files will be saved to: /uploads/galleries/
                      {userGallery.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}/
                    </p>
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

                <div>
                  <Label htmlFor="title">Artwork Title *</Label>
                  <Input
                    id="title"
                    value={uploadData.title}
                    onChange={(e) => setUploadData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter artwork title"
                    maxLength={100}
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
                    maxLength={500}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0.01"
                      max="10000"
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
                      maxLength={50}
                    />
                  </div>
                </div>

                {/* Content Warning */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="adult-content"
                      checked={hasAdultContent}
                      onCheckedChange={(checked) => setHasAdultContent(checked as boolean)}
                    />
                    <div>
                      <label htmlFor="adult-content" className="text-sm font-medium text-gray-700 cursor-pointer">
                        This artwork contains adult content
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Check this if your artwork contains nudity, mature themes, or content intended for 18+ viewers
                      </p>
                    </div>
                  </div>

                  {hasAdultContent && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-orange-800 font-medium">Adult Content Warning</p>
                          <p className="text-xs text-orange-700 mt-1">
                            This artwork will be flagged as adult content and require age verification to view.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms Acceptance */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="accept-terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  />
                  <div>
                    <label htmlFor="accept-terms" className="text-sm text-gray-700 cursor-pointer">
                      I agree to the{" "}
                      <button
                        type="button"
                        onClick={() => setShowTerms(true)}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Terms and Conditions
                      </button>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      By uploading, you confirm you own the rights to this artwork
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleUpload}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={galleryArtworks.length >= maxArtworks || isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Artwork ({galleryArtworks.length}/{maxArtworks})
                    </>
                  )}
                </Button>
              </div>

              {/* Image Preview */}
              <div>
                <Label>Preview</Label>
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 h-80 flex items-center justify-center">
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button variant="destructive" size="sm" onClick={clearImage} className="absolute top-2 right-2">
                        <X className="w-4 h-4" />
                      </Button>
                      {hasAdultContent && (
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="destructive" className="bg-orange-500">
                            18+
                          </Badge>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                      <p>No image selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsConditions
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleTermsAccept}
        showAdultContent={hasAdultContent}
      />
    </div>
  )
}
