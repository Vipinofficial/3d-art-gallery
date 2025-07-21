import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Palette, Image, Sculpture, Camera, Clock } from 'lucide-react';

export default function GalleryCreator({ 
  templates, 
  artPieces, 
  onCreateGallery,
  onPreviewGallery 
}) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedArtworks, setSelectedArtworks] = useState([]);
  const [galleryInfo, setGalleryInfo] = useState({
    name: '',
    description: '',
    createdBy: ''
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setSelectedArtworks([]); // Reset artworks when template changes
  };

  const handleArtworkToggle = (artwork) => {
    if (selectedArtworks.find(art => art.id === artwork.id)) {
      setSelectedArtworks(selectedArtworks.filter(art => art.id !== artwork.id));
    } else {
      if (selectedArtworks.length < selectedTemplate?.maxArtworks) {
        setSelectedArtworks([...selectedArtworks, artwork]);
      }
    }
  };

  const handleCreateGallery = () => {
    if (!selectedTemplate || selectedArtworks.length === 0 || !galleryInfo.name) {
      return;
    }

    const newGallery = {
      id: `gallery_${Date.now()}`,
      ...galleryInfo,
      templateId: selectedTemplate.id,
      artworks: selectedArtworks.map((artwork, index) => ({
        artId: artwork.id,
        position: getArtworkPosition(index, selectedTemplate),
        wall: getArtworkWall(index, selectedTemplate),
        sold: false
      })),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      isActive: true,
      visitCount: 0,
      totalSales: 0
    };

    onCreateGallery(newGallery);
  };

  const getArtworkPosition = (index, template) => {
    const positions = template.layout.wallPositions.flatMap(wall => wall.positions);
    return positions[index % positions.length] || { x: 0, y: 2, z: 0 };
  };

  const getArtworkWall = (index, template) => {
    const wallPositions = template.layout.wallPositions;
    let currentIndex = 0;
    
    for (const wall of wallPositions) {
      if (index < currentIndex + wall.positions.length) {
        return wall.wall;
      }
      currentIndex += wall.positions.length;
    }
    return 'front';
  };

  const canProceedToStep2 = selectedTemplate !== null;
  const canProceedToStep3 = selectedArtworks.length > 0;
  const canCreateGallery = galleryInfo.name && galleryInfo.createdBy;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Art Gallery</h1>
        <p className="text-gray-600">Design a temporary virtual exhibition that lasts for 24 hours</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNum}
              </div>
              <div className="ml-2 text-sm font-medium text-gray-600">
                {stepNum === 1 && 'Choose Template'}
                {stepNum === 2 && 'Select Artworks'}
                {stepNum === 3 && 'Gallery Details'}
              </div>
              {stepNum < 3 && <div className="w-16 h-0.5 bg-gray-200 ml-4" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Template Selection */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Choose Your Gallery Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {template.name}
                    <Badge variant="outline">{template.maxArtworks} artworks</Badge>
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      <span className="text-sm">Wall: {template.wallColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Lighting: {template.lightingType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        Dimensions: {template.layout.dimensions.width} × {template.layout.dimensions.depth}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <Button 
              onClick={() => setStep(2)} 
              disabled={!canProceedToStep2}
            >
              Next: Select Artworks
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Artwork Selection */}
      {step === 2 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Select Artworks</h2>
              <p className="text-gray-600">
                Choose up to {selectedTemplate?.maxArtworks} artworks for your gallery
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                Selected: {selectedArtworks.length} / {selectedTemplate?.maxArtworks}
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Artworks</TabsTrigger>
              <TabsTrigger value="painting">
                <Image className="w-4 h-4 mr-1" />
                Paintings
              </TabsTrigger>
              <TabsTrigger value="sculpture">
                <Sculpture className="w-4 h-4 mr-1" />
                Sculptures
              </TabsTrigger>
              <TabsTrigger value="photo">
                <Camera className="w-4 h-4 mr-1" />
                Photos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ArtworkGrid 
                artworks={artPieces} 
                selectedArtworks={selectedArtworks}
                onArtworkToggle={handleArtworkToggle}
                maxSelection={selectedTemplate?.maxArtworks}
              />
            </TabsContent>

            <TabsContent value="painting">
              <ArtworkGrid 
                artworks={artPieces.filter(art => art.type === 'painting')} 
                selectedArtworks={selectedArtworks}
                onArtworkToggle={handleArtworkToggle}
                maxSelection={selectedTemplate?.maxArtworks}
              />
            </TabsContent>

            <TabsContent value="sculpture">
              <ArtworkGrid 
                artworks={artPieces.filter(art => art.type === 'sculpture')} 
                selectedArtworks={selectedArtworks}
                onArtworkToggle={handleArtworkToggle}
                maxSelection={selectedTemplate?.maxArtworks}
              />
            </TabsContent>

            <TabsContent value="photo">
              <ArtworkGrid 
                artworks={artPieces.filter(art => art.type === 'photo')} 
                selectedArtworks={selectedArtworks}
                onArtworkToggle={handleArtworkToggle}
                maxSelection={selectedTemplate?.maxArtworks}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back: Choose Template
            </Button>
            <Button 
              onClick={() => setStep(3)} 
              disabled={!canProceedToStep3}
            >
              Next: Gallery Details
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Gallery Details */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Gallery Details</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="galleryName">Gallery Name *</Label>
                <Input
                  id="galleryName"
                  placeholder="Enter your gallery name"
                  value={galleryInfo.name}
                  onChange={(e) => setGalleryInfo({...galleryInfo, name: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="galleryDescription">Description</Label>
                <Textarea
                  id="galleryDescription"
                  placeholder="Describe your gallery exhibition"
                  value={galleryInfo.description}
                  onChange={(e) => setGalleryInfo({...galleryInfo, description: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="createdBy">Your Name *</Label>
                <Input
                  id="createdBy"
                  placeholder="Enter your name"
                  value={galleryInfo.createdBy}
                  onChange={(e) => setGalleryInfo({...galleryInfo, createdBy: e.target.value})}
                />
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Gallery Duration</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Your gallery will be active for 24 hours from creation. After that, it will be automatically archived.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Gallery Summary</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Template:</span> {selectedTemplate?.name}
                    </div>
                    <div>
                      <span className="font-medium">Artworks:</span> {selectedArtworks.length}
                    </div>
                    <div>
                      <span className="font-medium">Total Value:</span> $
                      {selectedArtworks.reduce((sum, art) => sum + art.price, 0).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4 space-y-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(true)}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Gallery
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back: Select Artworks
            </Button>
            <Button 
              onClick={handleCreateGallery}
              disabled={!canCreateGallery}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Gallery
            </Button>
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      {showPreview && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Gallery Preview</DialogTitle>
              <DialogDescription>
                Preview of your gallery with selected template and artworks
              </DialogDescription>
            </DialogHeader>
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">3D Gallery Preview will be rendered here</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Artwork Grid Component
function ArtworkGrid({ artworks, selectedArtworks, onArtworkToggle, maxSelection }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {artworks.map((artwork) => {
        const isSelected = selectedArtworks.find(art => art.id === artwork.id);
        const canSelect = selectedArtworks.length < maxSelection || isSelected;

        return (
          <Card 
            key={artwork.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected ? 'ring-2 ring-blue-500' : ''
            } ${!canSelect ? 'opacity-50' : ''}`}
            onClick={() => canSelect && onArtworkToggle(artwork)}
          >
            <div className="relative">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-32 object-cover rounded-t-lg"
              />
              {isSelected && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  ✓
                </div>
              )}
              <Badge className="absolute bottom-2 left-2" variant="outline">
                {artwork.category}
              </Badge>
            </div>
            <CardContent className="p-3">
              <h4 className="font-semibold text-sm truncate">{artwork.title}</h4>
              <p className="text-xs text-gray-600 truncate">{artwork.artist}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-bold text-green-600">${artwork.price}</span>
                <Badge variant={artwork.available ? "default" : "destructive"} className="text-xs">
                  {artwork.available ? "Available" : "Sold"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

