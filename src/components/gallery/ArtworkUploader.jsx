import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

export default function ArtworkUploader({ onArtworkAdd, maxArtworks = 6, currentCount = 0 }) {
  const [uploadedArtworks, setUploadedArtworks] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    
    fileArray.forEach((file) => {
      if (!supportedFormats.includes(file.type)) {
        alert(`File ${file.name} is not supported. Please use JPG, PNG, SVG, WebP, or GIF formats.`);
        return;
      }
      
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }
      
      if (currentCount + uploadedArtworks.length >= maxArtworks) {
        alert(`Maximum ${maxArtworks} artworks allowed.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newArtwork = {
          id: Date.now() + Math.random(),
          title: file.name.split('.')[0],
          artist: 'Your Artwork',
          price: 0,
          file: file,
          imageUrl: e.target.result,
          category: 'uploaded',
          uploadedAt: new Date().toISOString()
        };
        
        setUploadedArtworks(prev => [...prev, newArtwork]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const updateArtworkDetails = (artworkId, field, value) => {
    setUploadedArtworks(prev => 
      prev.map(artwork => 
        artwork.id === artworkId 
          ? { ...artwork, [field]: value }
          : artwork
      )
    );
  };

  const removeArtwork = (artworkId) => {
    setUploadedArtworks(prev => prev.filter(artwork => artwork.id !== artworkId));
  };

  const addToGallery = (artwork) => {
    const position = [
      (currentCount % 3) * 3 - 3,
      1,
      -9.5
    ];
    onArtworkAdd({ ...artwork, position });
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-8">
          <div
            className={`text-center ${dragActive ? 'bg-blue-50 border-blue-300' : ''} 
                       border-2 border-dashed rounded-lg p-8 transition-all`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="text-6xl">🎨</div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload Your Artwork</h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your images here, or click to browse
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="mb-4"
                >
                  Choose Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.svg,.webp,.gif"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
              <div className="text-sm text-gray-500">
                <p>Supported formats: JPG, PNG, SVG, WebP, GIF</p>
                <p>Maximum file size: 10MB per image</p>
                <p>Maximum {maxArtworks} artworks per gallery</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Artworks */}
      {uploadedArtworks.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Your Uploaded Artworks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uploadedArtworks.map((artwork) => (
              <Card key={artwork.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img 
                    src={artwork.imageUrl} 
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`title-${artwork.id}`}>Title</Label>
                      <Input
                        id={`title-${artwork.id}`}
                        value={artwork.title}
                        onChange={(e) => updateArtworkDetails(artwork.id, 'title', e.target.value)}
                        placeholder="Artwork title"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`artist-${artwork.id}`}>Artist</Label>
                      <Input
                        id={`artist-${artwork.id}`}
                        value={artwork.artist}
                        onChange={(e) => updateArtworkDetails(artwork.id, 'artist', e.target.value)}
                        placeholder="Artist name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`price-${artwork.id}`}>Price ($)</Label>
                      <Input
                        id={`price-${artwork.id}`}
                        type="number"
                        min="0"
                        value={artwork.price}
                        onChange={(e) => updateArtworkDetails(artwork.id, 'price', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`category-${artwork.id}`}>Category</Label>
                      <select
                        id={`category-${artwork.id}`}
                        value={artwork.category}
                        onChange={(e) => updateArtworkDetails(artwork.id, 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="painting">Painting</option>
                        <option value="photography">Photography</option>
                        <option value="digital">Digital Art</option>
                        <option value="sculpture">Sculpture</option>
                        <option value="mixed">Mixed Media</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`description-${artwork.id}`}>Description (Optional)</Label>
                    <Textarea
                      id={`description-${artwork.id}`}
                      value={artwork.description || ''}
                      onChange={(e) => updateArtworkDetails(artwork.id, 'description', e.target.value)}
                      placeholder="Describe your artwork..."
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{artwork.category}</Badge>
                      <span className="text-sm text-gray-500">
                        {(artwork.file.size / 1024 / 1024).toFixed(1)}MB
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => addToGallery(artwork)}
                        disabled={currentCount >= maxArtworks}
                      >
                        Add to Gallery
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeArtwork(artwork.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">💡 Upload Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ul className="space-y-2 text-sm">
            <li>• Use high-resolution images for better quality in 3D view</li>
            <li>• Square or landscape orientations work best for gallery walls</li>
            <li>• SVG files will maintain crisp quality at any size</li>
            <li>• Add detailed titles and descriptions to enhance visitor experience</li>
            <li>• Set appropriate prices if you plan to sell your artwork</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

