import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Plane, useTexture } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ArtworkUploader from './ArtworkUploader';
import dataManager from '../../lib/dataManager';

// Gallery Template Components
function GalleryRoom({ template, artworks = [] }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floor */}
      <Plane 
        args={[20, 20]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2, 0]}
      >
        <meshStandardMaterial color={template.floorColor || "#f0f0f0"} />
      </Plane>
      
      {/* Walls */}
      <Plane args={[20, 8]} position={[0, 2, -10]}>
        <meshStandardMaterial color={template.wallColor || "#ffffff"} />
      </Plane>
      <Plane args={[20, 8]} position={[-10, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color={template.wallColor || "#ffffff"} />
      </Plane>
      <Plane args={[20, 8]} position={[10, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <meshStandardMaterial color={template.wallColor || "#ffffff"} />
      </Plane>
      
      {/* Ceiling */}
      <Plane 
        args={[20, 20]} 
        rotation={[Math.PI / 2, 0, 0]} 
        position={[0, 6, 0]}
      >
        <meshStandardMaterial color={template.ceilingColor || "#f8f8f8"} />
      </Plane>
      
      {/* Artworks */}
      {artworks.map((artwork, index) => (
        <ArtworkFrame 
          key={artwork.id} 
          artwork={artwork} 
          position={artwork.position || [index * 3 - 6, 1, -9.5]}
        />
      ))}
      
      {/* Lighting based on template */}
      {template.lighting === 'modern' && (
        <>
          <pointLight position={[5, 4, 5]} intensity={0.8} color="#ffffff" />
          <pointLight position={[-5, 4, 5]} intensity={0.8} color="#ffffff" />
          <pointLight position={[0, 4, -5]} intensity={0.6} color="#ffffff" />
        </>
      )}
      
      {template.lighting === 'warm' && (
        <>
          <pointLight position={[0, 5, 0]} intensity={1.2} color="#fff8dc" />
          <spotLight position={[0, 8, 5]} intensity={0.8} color="#ffd700" angle={0.3} />
        </>
      )}
      
      {template.lighting === 'dramatic' && (
        <>
          <spotLight position={[-8, 6, 0]} intensity={1.5} color="#ffffff" angle={0.4} />
          <spotLight position={[8, 6, 0]} intensity={1.5} color="#ffffff" angle={0.4} />
          <pointLight position={[0, 2, 8]} intensity={0.3} color="#4169e1" />
        </>
      )}
    </group>
  );
}

function ArtworkFrame({ artwork, position }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState(null);
  
  useEffect(() => {
    if (artwork.imageUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(artwork.imageUrl, (loadedTexture) => {
        setTexture(loadedTexture);
      });
    }
  }, [artwork.imageUrl]);
  
  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: hovered ? 1.05 : 1,
        y: hovered ? 1.05 : 1,
        z: hovered ? 1.05 : 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [hovered]);

  return (
    <group position={position}>
      {/* Frame */}
      <Box args={[2.2, 1.7, 0.1]} position={[0, 0, -0.05]}>
        <meshStandardMaterial color="#8b4513" />
      </Box>
      
      {/* Artwork */}
      <Plane 
        ref={meshRef}
        args={[2, 1.5]} 
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial 
          map={texture}
          color={texture ? "#ffffff" : (artwork.color || "#ffffff")} 
          transparent
          opacity={0.9}
        />
      </Plane>
      
      {/* Artwork Label */}
      <Text
        position={[0, -1, 0.1]}
        fontSize={0.1}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        {artwork.title || "Untitled"}
      </Text>
      
      {/* Artist Name */}
      <Text
        position={[0, -1.15, 0.1]}
        fontSize={0.08}
        color="#666666"
        anchorX="center"
        anchorY="middle"
      >
        {artwork.artist || "Unknown Artist"}
      </Text>
      
      {/* Price Tag */}
      {artwork.price && artwork.price > 0 && (
        <Text
          position={[0, -1.3, 0.1]}
          fontSize={0.08}
          color="#666666"
          anchorX="center"
          anchorY="middle"
        >
          ${artwork.price}
        </Text>
      )}
    </group>
  );
}

function CameraController({ template }) {
  const { camera } = useThree();
  
  useEffect(() => {
    const positions = {
      'modern': { x: 0, y: 3, z: 8 },
      'traditional': { x: -2, y: 4, z: 10 },
      'contemporary': { x: 3, y: 2, z: 6 }
    };
    
    const targetPosition = positions[template.style] || positions.modern;
    
    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 2,
      ease: "power2.inOut"
    });
  }, [camera, template]);
  
  return null;
}

// Main Gallery Creator Component
export default function GalleryCreator3D({ onGalleryCreated }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [galleryName, setGalleryName] = useState('');
  const [selectedArtworks, setSelectedArtworks] = useState([]);
  const [currentStep, setCurrentStep] = useState('template');
  const [isCreating, setIsCreating] = useState(false);
  
  const templates = [
    {
      id: 'modern',
      name: 'Modern Minimalist',
      description: 'Clean white walls with spot lighting',
      style: 'modern',
      wallColor: '#ffffff',
      floorColor: '#f5f5f5',
      ceilingColor: '#fafafa',
      lighting: 'modern',
      preview: '/api/placeholder/300/200'
    },
    {
      id: 'traditional',
      name: 'Traditional Gallery',
      description: 'Classic museum-style layout',
      style: 'traditional',
      wallColor: '#f8f6f0',
      floorColor: '#8b4513',
      ceilingColor: '#fff8dc',
      lighting: 'warm',
      preview: '/api/placeholder/300/200'
    },
    {
      id: 'contemporary',
      name: 'Contemporary Space',
      description: 'Industrial design with dramatic lighting',
      style: 'contemporary',
      wallColor: '#2c2c2c',
      floorColor: '#1a1a1a',
      ceilingColor: '#333333',
      lighting: 'dramatic',
      preview: '/api/placeholder/300/200'
    }
  ];
  
  const handleArtworkAdd = (artwork) => {
    if (selectedArtworks.length >= 6) {
      alert('Maximum 6 artworks allowed per gallery');
      return;
    }
    
    const position = [
      (selectedArtworks.length % 3) * 3 - 3,
      1,
      -9.5
    ];
    
    setSelectedArtworks(prev => [...prev, { ...artwork, position }]);
  };

  const handleArtworkRemove = (artworkId) => {
    setSelectedArtworks(prev => prev.filter(artwork => artwork.id !== artworkId));
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    
    // Add sample artworks for testing with accessible image URLs
    const sampleArtworks = [
      {
        id: 'sample_1',
        title: 'Abstract Composition',
        artist: 'Test Artist',
        price: 250,
        imageUrl: 'https://picsum.photos/800/600?random=1',
        category: 'painting',
        description: 'A vibrant abstract painting with geometric shapes',
        position: [-3, 1, -9.5]
      },
      {
        id: 'sample_2',
        title: 'Mountain Landscape',
        artist: 'Test Artist',
        price: 180,
        imageUrl: 'https://picsum.photos/800/600?random=2',
        category: 'painting',
        description: 'A peaceful landscape painting of mountains and lake',
        position: [0, 1, -9.5]
      },
      {
        id: 'sample_3',
        title: 'Urban Scene',
        artist: 'Test Artist',
        price: 320,
        imageUrl: 'https://picsum.photos/800/600?random=3',
        category: 'photography',
        description: 'A dynamic urban photography piece',
        position: [3, 1, -9.5]
      }
    ];
    
    setSelectedArtworks(sampleArtworks);
    setCurrentStep('artworks');
  };

  const handleCreateGallery = async () => {
    if (!galleryName.trim()) {
      alert('Please enter a gallery name');
      return;
    }
    
    if (selectedArtworks.length === 0) {
      alert('Please add at least one artwork to your gallery');
      return;
    }
    
    setIsCreating(true);
    
    try {
      const newGallery = {
        id: dataManager.generateId('gallery'),
        name: galleryName.trim(),
        template: selectedTemplate,
        artworks: selectedArtworks,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        visitCount: 0,
        lastVisited: null,
        shareableLink: null // Will be generated when needed
      };
      
      // Save gallery using dataManager
      const success = dataManager.saveGallery(newGallery);
      
      if (success) {
        alert(`Gallery "${galleryName}" created successfully!`);
        
        // Reset form
        setGalleryName('');
        setSelectedTemplate(null);
        setSelectedArtworks([]);
        setCurrentStep('template');
        
        // Notify parent component
        if (onGalleryCreated) {
          onGalleryCreated(newGallery);
        }
      } else {
        throw new Error('Failed to save gallery');
      }
    } catch (error) {
      console.error('Error creating gallery:', error);
      alert('Failed to create gallery. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-8 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl text-white">
        <h2 className="text-3xl font-bold mb-4">Create Your 3D Gallery</h2>
        <p className="text-lg opacity-90">
          Design immersive virtual exhibitions with Three.js and WebGL
        </p>
      </div>

      <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="template">Choose Template</TabsTrigger>
          <TabsTrigger value="artworks" disabled={!selectedTemplate}>Select Artworks</TabsTrigger>
          <TabsTrigger value="preview" disabled={!selectedTemplate || selectedArtworks.length === 0}>Preview & Create</TabsTrigger>
        </TabsList>

        {/* Template Selection */}
        <TabsContent value="template" className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-4">Choose a Gallery Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-gradient-to-br rounded-lg mb-4" 
                         style={{
                           background: `linear-gradient(135deg, ${template.wallColor}, ${template.floorColor})`
                         }}>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{template.style}</Badge>
                      {selectedTemplate?.id === template.id && (
                        <Badge>Selected</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Artwork Selection */}
        <TabsContent value="artworks" className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-4">Upload Your Artworks</h3>
            <p className="text-gray-600 mb-6">
              Upload your own artwork files. Supported formats: JPG, PNG, SVG, WebP, GIF
            </p>
            
            <ArtworkUploader 
              onArtworkAdd={handleArtworkAdd}
              maxArtworks={6}
              currentCount={selectedArtworks.length}
            />
            
            {/* Selected Artworks Display */}
            {selectedArtworks.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">
                  Selected Artworks ({selectedArtworks.length}/6)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedArtworks.map((artwork) => (
                    <Card key={artwork.id} className="overflow-hidden">
                      <div className="aspect-video bg-gray-100 overflow-hidden">
                        {artwork.imageUrl ? (
                          <img 
                            src={artwork.imageUrl} 
                            alt={artwork.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div 
                            className="w-full h-full"
                            style={{ backgroundColor: artwork.color || '#f0f0f0' }}
                          />
                        )}
                      </div>
                      <CardContent className="p-3">
                        <h5 className="font-semibold text-sm truncate">{artwork.title}</h5>
                        <p className="text-xs text-gray-600 truncate">{artwork.artist}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm font-bold">
                            {artwork.price > 0 ? `$${artwork.price}` : 'Free'}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleArtworkRemove(artwork.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Preview & Create */}
        <TabsContent value="preview" className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-4">Preview Your Gallery</h3>
            
            {/* Gallery Name Input */}
            <div className="mb-6">
              <Label htmlFor="galleryName">Gallery Name</Label>
              <Input
                id="galleryName"
                value={galleryName}
                onChange={(e) => setGalleryName(e.target.value)}
                placeholder="Enter your gallery name..."
                className="mt-1"
              />
            </div>

            {/* 3D Preview */}
            <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Canvas camera={{ position: [0, 3, 8], fov: 75 }}>
                <ambientLight intensity={0.4} />
                <Suspense fallback={null}>
                  {selectedTemplate && (
                    <>
                      <GalleryRoom template={selectedTemplate} artworks={selectedArtworks} />
                      <CameraController template={selectedTemplate} />
                    </>
                  )}
                </Suspense>
                <OrbitControls 
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  maxPolarAngle={Math.PI / 2}
                  minDistance={3}
                  maxDistance={15}
                />
              </Canvas>
            </div>

            {/* Gallery Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Gallery Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Template</p>
                    <p className="font-semibold">{selectedTemplate?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Artworks</p>
                    <p className="font-semibold">{selectedArtworks.length} pieces</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="font-semibold">
                      ${selectedArtworks.reduce((sum, artwork) => sum + artwork.price, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold">7 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Create Button */}
            <div className="flex justify-center pt-6">
              <Button 
                onClick={handleCreateGallery}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                disabled={!galleryName.trim() || selectedArtworks.length === 0 || isCreating}
              >
                {isCreating ? 'Creating Gallery...' : 'Create Gallery'}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

