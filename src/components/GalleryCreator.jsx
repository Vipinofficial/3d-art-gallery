import React, { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Upload, X, Eye, Download, Share2, Palette, Zap, Globe } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box, Plane } from '@react-three/drei';
import * as THREE from 'three';

// Gallery template options
const galleryTemplates = [
  {
    id: 'modern',
    name: 'Modern Gallery',
    description: 'Clean white walls with professional lighting',
    preview: '/api/placeholder/300/200',
    wallColor: '#ffffff',
    floorColor: '#f5f5f5',
    lightingIntensity: 1.2
  },
  {
    id: 'dark',
    name: 'Dark Gallery',
    description: 'Dramatic black walls with accent lighting',
    preview: '/api/placeholder/300/200',
    wallColor: '#1a1a1a',
    floorColor: '#0a0a0a',
    lightingIntensity: 0.8
  },
  {
    id: 'industrial',
    name: 'Industrial Loft',
    description: 'Exposed brick walls with warm lighting',
    preview: '/api/placeholder/300/200',
    wallColor: '#8b4513',
    floorColor: '#654321',
    lightingIntensity: 1.0
  },
  {
    id: 'futuristic',
    name: 'Futuristic Space',
    description: 'Neon-lit environment with metallic surfaces',
    preview: '/api/placeholder/300/200',
    wallColor: '#2a2a3a',
    floorColor: '#1a1a2a',
    lightingIntensity: 1.5
  }
];

// 3D Gallery Preview Component
function GalleryPreview({ artworks, template, galleryName }) {
  const groupRef = useRef();

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden bg-black">
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={template.lightingIntensity} />
        <pointLight position={[-10, 10, 10]} intensity={template.lightingIntensity * 0.7} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={0.5}
          intensity={template.lightingIntensity}
          castShadow
        />

        {/* Gallery Room */}
        <group ref={groupRef}>
          {/* Floor */}
          <Plane 
            args={[20, 20]} 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, -2, 0]}
            receiveShadow
          >
            <meshLambertMaterial color={template.floorColor} />
          </Plane>

          {/* Back Wall */}
          <Plane args={[20, 10]} position={[0, 3, -10]}>
            <meshLambertMaterial color={template.wallColor} />
          </Plane>

          {/* Left Wall */}
          <Plane 
            args={[20, 10]} 
            rotation={[0, Math.PI / 2, 0]} 
            position={[-10, 3, 0]}
          >
            <meshLambertMaterial color={template.wallColor} />
          </Plane>

          {/* Right Wall */}
          <Plane 
            args={[20, 10]} 
            rotation={[0, -Math.PI / 2, 0]} 
            position={[10, 3, 0]}
          >
            <meshLambertMaterial color={template.wallColor} />
          </Plane>

          {/* Gallery Title */}
          <Text
            position={[0, 6, -9.9]}
            fontSize={0.8}
            color="#333333"
            anchorX="center"
            anchorY="middle"
          >
            {galleryName || 'My Gallery'}
          </Text>

          {/* Artwork Frames */}
          {artworks.map((artwork, index) => {
            const positions = [
              [-6, 3, -9.8],  // Back wall left
              [0, 3, -9.8],   // Back wall center
              [6, 3, -9.8],   // Back wall right
              [-9.8, 3, -6],  // Left wall
              [-9.8, 3, 0],   // Left wall center
              [9.8, 3, -6],   // Right wall
              [9.8, 3, 0],    // Right wall center
            ];

            const rotations = [
              [0, 0, 0],      // Back wall
              [0, 0, 0],      // Back wall
              [0, 0, 0],      // Back wall
              [0, Math.PI / 2, 0],  // Left wall
              [0, Math.PI / 2, 0],  // Left wall
              [0, -Math.PI / 2, 0], // Right wall
              [0, -Math.PI / 2, 0], // Right wall
            ];

            if (index >= positions.length) return null;

            return (
              <group key={artwork.id} position={positions[index]} rotation={rotations[index]}>
                {/* Frame */}
                <Box args={[3.2, 2.4, 0.1]} position={[0, 0, -0.05]}>
                  <meshLambertMaterial color="#8b4513" />
                </Box>
                
                {/* Artwork */}
                <Plane args={[3, 2.2]}>
                  {artwork.imageUrl ? (
                    <meshLambertMaterial>
                      <primitive object={new THREE.TextureLoader().load(artwork.imageUrl)} attach="map" />
                    </meshLambertMaterial>
                  ) : (
                    <meshLambertMaterial color="#cccccc" />
                  )}
                </Plane>

                {/* Artwork Title */}
                <Text
                  position={[0, -1.5, 0.1]}
                  fontSize={0.2}
                  color="#333333"
                  anchorX="center"
                  anchorY="middle"
                >
                  {artwork.title}
                </Text>

                {/* Spotlight for artwork */}
                <spotLight
                  position={[0, 2, 1]}
                  angle={0.3}
                  penumbra={0.5}
                  intensity={0.8}
                  target-position={[0, 0, 0]}
                />
              </group>
            );
          })}
        </group>
      </Canvas>
    </div>
  );
}

// File Upload Component
function FileUpload({ onFilesSelected, maxFiles = 10 }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).slice(0, maxFiles);
      onFilesSelected(files);
    }
  }, [onFilesSelected, maxFiles]);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files).slice(0, maxFiles);
      onFilesSelected(files);
    }
  }, [onFilesSelected, maxFiles]);

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive 
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        Drop your artwork here
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        or click to browse files (max {maxFiles} images)
      </p>
      <Button onClick={onButtonClick} variant="outline">
        Select Files
      </Button>
    </div>
  );
}

// Artwork Item Component
function ArtworkItem({ artwork, onUpdate, onRemove }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(artwork.title);
  const [description, setDescription] = useState(artwork.description);

  const handleSave = () => {
    onUpdate(artwork.id, { title, description });
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-full object-cover"
        />
        <Button
          size="sm"
          variant="destructive"
          className="absolute top-2 right-2"
          onClick={() => onRemove(artwork.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Artwork title"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-medium text-sm mb-1">{artwork.title}</h3>
            {artwork.description && (
              <p className="text-xs text-gray-500 mb-2">{artwork.description}</p>
            )}
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              Edit Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Main Gallery Creator Component
export default function GalleryCreator({ onGalleryCreated }) {
  const [step, setStep] = useState(1);
  const [galleryName, setGalleryName] = useState('');
  const [galleryDescription, setGalleryDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(galleryTemplates[0]);
  const [artworks, setArtworks] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = useCallback((files) => {
    const newArtworks = files.map((file, index) => ({
      id: Date.now() + index,
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: '',
      file: file,
      imageUrl: URL.createObjectURL(file)
    }));

    setArtworks(prev => [...prev, ...newArtworks]);
  }, []);

  const updateArtwork = useCallback((id, updates) => {
    setArtworks(prev => prev.map(artwork => 
      artwork.id === id ? { ...artwork, ...updates } : artwork
    ));
  }, []);

  const removeArtwork = useCallback((id) => {
    setArtworks(prev => {
      const artwork = prev.find(a => a.id === id);
      if (artwork?.imageUrl) {
        URL.revokeObjectURL(artwork.imageUrl);
      }
      return prev.filter(a => a.id !== id);
    });
  }, []);

  const createGallery = async () => {
    setIsCreating(true);
    setProgress(0);

    try {
      // Simulate gallery creation process
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const gallery = {
        id: Date.now(),
        name: galleryName,
        description: galleryDescription,
        template: selectedTemplate,
        artworks: artworks,
        createdAt: new Date().toISOString(),
        isPublic: true
      };

      // Save to localStorage for demo purposes
      const existingGalleries = JSON.parse(localStorage.getItem('galleries') || '[]');
      existingGalleries.push(gallery);
      localStorage.setItem('galleries', JSON.stringify(existingGalleries));

      if (onGalleryCreated) {
        onGalleryCreated(gallery);
      }

      // Reset form
      setStep(1);
      setGalleryName('');
      setGalleryDescription('');
      setArtworks([]);
      setSelectedTemplate(galleryTemplates[0]);

    } catch (error) {
      console.error('Error creating gallery:', error);
    } finally {
      setIsCreating(false);
      setProgress(0);
    }
  };

  const canProceedToNext = () => {
    switch (step) {
      case 1: return galleryName.trim().length > 0;
      case 2: return selectedTemplate !== null;
      case 3: return artworks.length > 0;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 4 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Gallery Information
            </CardTitle>
            <CardDescription>
              Give your gallery a name and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="gallery-name">Gallery Name *</Label>
              <Input
                id="gallery-name"
                value={galleryName}
                onChange={(e) => setGalleryName(e.target.value)}
                placeholder="Enter your gallery name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="gallery-description">Description</Label>
              <Textarea
                id="gallery-description"
                value={galleryDescription}
                onChange={(e) => setGalleryDescription(e.target.value)}
                placeholder="Describe your gallery (optional)"
                className="mt-1"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Choose Gallery Template
            </CardTitle>
            <CardDescription>
              Select a template that matches your artistic vision
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {galleryTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-gray-500">Template Preview</span>
                    </div>
                    <h3 className="font-medium mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    {selectedTemplate?.id === template.id && (
                      <Badge className="mt-2">Selected</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Artwork
              </CardTitle>
              <CardDescription>
                Add your digital artwork to the gallery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload onFilesSelected={handleFilesSelected} />
            </CardContent>
          </Card>

          {artworks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Artworks ({artworks.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {artworks.map((artwork) => (
                    <ArtworkItem
                      key={artwork.id}
                      artwork={artwork}
                      onUpdate={updateArtwork}
                      onRemove={removeArtwork}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview Your Gallery
              </CardTitle>
              <CardDescription>
                See how your gallery will look to visitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GalleryPreview
                artworks={artworks}
                template={selectedTemplate}
                galleryName={galleryName}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gallery Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Name</Label>
                <p className="font-medium">{galleryName}</p>
              </div>
              {galleryDescription && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-gray-600">{galleryDescription}</p>
                </div>
              )}
              <div>
                <Label>Template</Label>
                <p className="font-medium">{selectedTemplate.name}</p>
              </div>
              <div>
                <Label>Artworks</Label>
                <p className="font-medium">{artworks.length} pieces</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(step - 1)}
          disabled={step === 1 || isCreating}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceedToNext() || isCreating}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={createGallery}
              disabled={isCreating || artworks.length === 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {isCreating ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Creating Gallery...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Create Gallery
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {isCreating && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Creating your gallery...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

