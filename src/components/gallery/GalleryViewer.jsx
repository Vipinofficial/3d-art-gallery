import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Plane } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import dataManager from '../../lib/dataManager';

// Gallery Room Component for Viewer
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
  const [showDetails, setShowDetails] = useState(false);
  const [textureLoaded, setTextureLoaded] = useState(false);
  
  useEffect(() => {
    const imageUrl = artwork.imageUrl || artwork.image;
    console.log('Loading texture for artwork:', artwork.title, 'URL:', imageUrl);
    
    if (imageUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(
        imageUrl, 
        (loadedTexture) => {
          console.log('Texture loaded successfully for:', artwork.title);
          setTexture(loadedTexture);
          setTextureLoaded(true);
        },
        undefined,
        (error) => {
          console.error('Failed to load texture for:', artwork.title, error);
          setTextureLoaded(false);
        }
      );
    } else {
      console.warn('No image URL found for artwork:', artwork.title);
      setTextureLoaded(false);
    }
  }, [artwork.imageUrl, artwork.image, artwork.title]);
  
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

  const handleClick = () => {
    setShowDetails(true);
  };

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
        onClick={handleClick}
      >
        {textureLoaded && texture ? (
          <meshStandardMaterial 
            map={texture}
            transparent
            opacity={0.9}
          />
        ) : (
          <meshStandardMaterial 
            color={artwork.color || "#e0e0e0"} 
            transparent
            opacity={0.9}
          />
        )}
      </Plane>
      
      {/* Loading indicator for failed textures */}
      {!textureLoaded && artwork.imageUrl && (
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.15}
          color="#666666"
          anchorX="center"
          anchorY="middle"
        >
          Loading...
        </Text>
      )}
      
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

// Main Gallery Viewer Component
export default function GalleryViewer({ galleryId, onClose }) {
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        
        // Initialize data manager if needed
        await dataManager.initializeData();
        
        // Load gallery by ID
        const galleryData = dataManager.getGalleryById(galleryId);
        
        if (!galleryData) {
          setError('Gallery not found or may have expired');
          return;
        }
        
        if (galleryData.isExpired) {
          setError('This gallery has expired');
          return;
        }
        
        setGallery(galleryData);
        
        // Record visit
        dataManager.recordGalleryVisit(galleryId);
        
      } catch (err) {
        console.error('Error loading gallery:', err);
        setError('Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    if (galleryId) {
      loadGallery();
    }
  }, [galleryId]);

  const formatTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const handlePurchaseArtwork = (artwork) => {
    // Simple purchase simulation
    const purchase = {
      id: dataManager.generateId('purchase'),
      artId: artwork.id,
      galleryId: gallery.id,
      buyerInfo: {
        name: prompt('Enter your name:') || 'Anonymous',
        email: prompt('Enter your email:') || 'anonymous@example.com'
      },
      paymentInfo: {
        amount: artwork.price,
        currency: 'USD',
        method: 'credit_card'
      },
      purchaseDate: new Date().toISOString()
    };
    
    if (dataManager.savePurchase(purchase)) {
      alert(`Thank you for purchasing "${artwork.title}"!`);
      setSelectedArtwork(null);
      
      // Reload gallery to reflect sold status
      const updatedGallery = dataManager.getGalleryById(galleryId);
      setGallery(updatedGallery);
    } else {
      alert('Purchase failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Gallery Not Available</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            {onClose && (
              <Button onClick={onClose}>
                Back to Home
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">3D</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{gallery.name}</h1>
                <p className="text-sm text-gray-600">
                  {gallery.template?.name} • Expires in {formatTimeRemaining(gallery.expiresAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {gallery.artworks?.length || 0} artworks
              </Badge>
              <Badge variant="outline">
                {gallery.visitCount || 0} visits
              </Badge>
              {onClose && (
                <Button onClick={onClose} variant="outline">
                  Back to Home
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 3D Gallery View */}
        <div className="h-96 bg-gray-100 rounded-lg overflow-hidden mb-8">
          <Canvas camera={{ position: [0, 3, 8], fov: 75 }}>
            <ambientLight intensity={0.4} />
            <Suspense fallback={null}>
              {gallery.template && (
                <>
                  <GalleryRoom template={gallery.template} artworks={gallery.artworks || []} />
                  <CameraController template={gallery.template} />
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

        {/* Gallery Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Gallery Information</CardTitle>
            <CardDescription>
              Created on {dataManager.formatDate(gallery.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Template</p>
                <p className="font-semibold">{gallery.template?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Artworks</p>
                <p className="font-semibold">{gallery.artworks?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="font-semibold">
                  {dataManager.formatCurrency(
                    gallery.artworks?.reduce((sum, artwork) => sum + (artwork.price || 0), 0) || 0
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="font-semibold">
                  {gallery.artworks?.filter(art => !art.sold).length || 0} pieces
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Artwork Grid */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Featured Artworks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.artworks?.map((artwork) => (
              <Card 
                key={artwork.id} 
                className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
                  artwork.sold ? 'opacity-60' : ''
                }`}
                onClick={() => setSelectedArtwork(artwork)}
              >
                <div className="aspect-video bg-gray-100 overflow-hidden relative">
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
                  {artwork.sold && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="destructive">SOLD</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h5 className="font-semibold text-lg mb-1">{artwork.title}</h5>
                  <p className="text-sm text-gray-600 mb-2">{artwork.artist}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">
                      {artwork.price > 0 ? dataManager.formatCurrency(artwork.price) : 'Free'}
                    </span>
                    {!artwork.sold && artwork.price > 0 && (
                      <Button size="sm">
                        View Details
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Artwork Detail Modal */}
        {selectedArtwork && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{selectedArtwork.title}</CardTitle>
                    <CardDescription className="text-lg">by {selectedArtwork.artist}</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedArtwork(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 overflow-hidden rounded-lg mb-4">
                  {selectedArtwork.imageUrl ? (
                    <img 
                      src={selectedArtwork.imageUrl} 
                      alt={selectedArtwork.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full"
                      style={{ backgroundColor: selectedArtwork.color || '#f0f0f0' }}
                    />
                  )}
                </div>
                
                <div className="space-y-4">
                  {selectedArtwork.description && (
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-gray-600">{selectedArtwork.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-1">Price</h4>
                      <p className="text-2xl font-bold">
                        {selectedArtwork.price > 0 ? dataManager.formatCurrency(selectedArtwork.price) : 'Free'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Status</h4>
                      <Badge variant={selectedArtwork.sold ? 'destructive' : 'default'}>
                        {selectedArtwork.sold ? 'Sold' : 'Available'}
                      </Badge>
                    </div>
                  </div>
                  
                  {!selectedArtwork.sold && selectedArtwork.price > 0 && (
                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={() => handlePurchaseArtwork(selectedArtwork)}
                        className="flex-1"
                      >
                        Purchase Now
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedArtwork(null)}
                      >
                        Close
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

