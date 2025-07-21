import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Box, Plane, Html, OrbitControls } from '@react-three/drei';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, Share2, Download, Eye, Heart } from 'lucide-react';
import * as THREE from 'three';

// Enhanced Gallery Frame with better image handling
function EnhancedGalleryFrame({ position, rotation, artwork, onClick, isSelected }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Load texture with proper error handling
  useEffect(() => {
    if (artwork?.imageUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(
        artwork.imageUrl,
        (loadedTexture) => {
          loadedTexture.flipY = false;
          loadedTexture.minFilter = THREE.LinearFilter;
          loadedTexture.magFilter = THREE.LinearFilter;
          setTexture(loadedTexture);
          setImageLoaded(true);
        },
        undefined,
        (error) => {
          console.warn('Failed to load texture:', artwork.imageUrl, error);
          setTexture(null);
          setImageLoaded(false);
        }
      );
    }
  }, [artwork?.imageUrl]);

  useFrame((state) => {
    if (meshRef.current) {
      const targetScale = hovered || isSelected ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      if (hovered || isSelected) {
        meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 2) * 0.05 + position[2];
      } else {
        meshRef.current.position.z = position[2];
      }
    }
  });

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onClick && onClick(artwork)}
    >
      {/* Frame */}
      <Box args={[4.2, 3.2, 0.2]} position={[0, 0, -0.1]}>
        <meshStandardMaterial 
          color={isSelected ? "#8b5cf6" : "#2a2a2a"} 
          metalness={0.3}
          roughness={0.7}
        />
      </Box>
      
      {/* Artwork */}
      <Plane args={[4, 3]}>
        {texture && imageLoaded ? (
          <meshStandardMaterial 
            map={texture} 
            transparent={false}
          />
        ) : (
          <meshStandardMaterial color="#4a5568">
            {/* Enhanced placeholder */}
            <primitive object={(() => {
              const canvas = document.createElement('canvas');
              canvas.width = 512;
              canvas.height = 512;
              const ctx = canvas.getContext('2d');
              
              // Create a more sophisticated placeholder
              const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
              gradient.addColorStop(0, '#8b5cf6');
              gradient.addColorStop(0.5, '#ec4899');
              gradient.addColorStop(1, '#06b6d4');
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, 512, 512);
              
              // Add artwork icon
              ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
              ctx.font = '48px Arial';
              ctx.textAlign = 'center';
              ctx.fillText('🎨', 256, 280);
              
              const placeholderTexture = new THREE.CanvasTexture(canvas);
              return placeholderTexture;
            })()} attach="map" />
          </meshStandardMaterial>
        )}
      </Plane>
      
      {/* Title */}
      {artwork?.title && (
        <Text
          position={[0, -2, 0.1]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.5}
        >
          {artwork.title}
        </Text>
      )}
      
      {/* Selection glow */}
      {(hovered || isSelected) && (
        <Plane args={[4.5, 3.5]} position={[0, 0, -0.05]}>
          <meshBasicMaterial
            color={isSelected ? "#8b5cf6" : "#ec4899"}
            transparent
            opacity={0.2}
          />
        </Plane>
      )}

      {/* Spotlight for selected artwork */}
      {isSelected && (
        <spotLight
          position={[0, 3, 2]}
          angle={0.3}
          penumbra={0.5}
          intensity={1.5}
          color="#ffffff"
          target-position={[0, 0, 0]}
        />
      )}
    </group>
  );
}

// Enhanced Gallery Room with better lighting
function EnhancedGalleryRoom({ template }) {
  return (
    <group>
      {/* Floor with reflection */}
      <Plane args={[50, 50]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
        <meshStandardMaterial 
          color={template?.floorColor || "#1a1a1a"} 
          metalness={0.1}
          roughness={0.8}
        />
      </Plane>
      
      {/* Walls */}
      <Plane args={[50, 20]} position={[0, 5, -25]} receiveShadow>
        <meshStandardMaterial color={template?.wallColor || "#2a2a2a"} />
      </Plane>
      
      <Plane args={[50, 20]} rotation={[0, Math.PI / 2, 0]} position={[-25, 5, 0]} receiveShadow>
        <meshStandardMaterial color={template?.wallColor || "#2a2a2a"} />
      </Plane>
      
      <Plane args={[50, 20]} rotation={[0, -Math.PI / 2, 0]} position={[25, 5, 0]} receiveShadow>
        <meshStandardMaterial color={template?.wallColor || "#2a2a2a"} />
      </Plane>
      
      {/* Ceiling */}
      <Plane args={[50, 50]} rotation={[Math.PI / 2, 0, 0]} position={[0, 15, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Plane>
    </group>
  );
}

// Camera controller with smooth transitions
function SmoothCameraController({ targetPosition, selectedArtwork }) {
  const { camera } = useThree();
  
  useFrame(() => {
    if (selectedArtwork) {
      // Focus on selected artwork
      const artworkPosition = new THREE.Vector3(...selectedArtwork.position);
      const cameraTarget = artworkPosition.clone().add(new THREE.Vector3(0, 0, 5));
      camera.position.lerp(cameraTarget, 0.03);
      camera.lookAt(artworkPosition);
    } else {
      // Default gallery view
      camera.position.lerp(new THREE.Vector3(...targetPosition), 0.05);
      camera.lookAt(0, 0, 0);
    }
  });
  
  return null;
}

// Main Gallery Viewer Component
export default function GalleryViewer({ gallery, onClose }) {
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [cameraPosition, setCameraPosition] = useState([0, 2, 10]);
  const [viewMode, setViewMode] = useState('explore'); // 'explore' or 'focus'
  const [likes, setLikes] = useState(0);

  // Artwork positions in the gallery
  const artworkPositions = [
    { position: [0, 3, -12], rotation: [0, 0, 0] },      // Back wall center
    { position: [-6, 3, -12], rotation: [0, 0, 0] },     // Back wall left
    { position: [6, 3, -12], rotation: [0, 0, 0] },      // Back wall right
    { position: [-12, 3, -6], rotation: [0, Math.PI / 2, 0] },  // Left wall
    { position: [-12, 3, 0], rotation: [0, Math.PI / 2, 0] },   // Left wall center
    { position: [-12, 3, 6], rotation: [0, Math.PI / 2, 0] },   // Left wall
    { position: [12, 3, -6], rotation: [0, -Math.PI / 2, 0] },  // Right wall
    { position: [12, 3, 0], rotation: [0, -Math.PI / 2, 0] },   // Right wall center
    { position: [12, 3, 6], rotation: [0, -Math.PI / 2, 0] },   // Right wall
  ];

  const handleArtworkClick = (artwork) => {
    setSelectedArtwork(artwork);
    setViewMode('focus');
  };

  const handleBackToGallery = () => {
    setSelectedArtwork(null);
    setViewMode('explore');
    setCameraPosition([0, 2, 10]);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: gallery?.name || 'Amazing Art Gallery',
        text: 'Check out this incredible virtual art gallery!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Gallery link copied to clipboard!');
    }
  };

  const handleLike = () => {
    setLikes(prev => prev + 1);
  };

  if (!gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Gallery Not Found</h2>
            <p className="text-gray-600 mb-4">The requested gallery could not be loaded.</p>
            <Button onClick={onClose}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative bg-black">
      {/* Gallery Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="bg-black/50 border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">{gallery.name}</h1>
              {gallery.description && (
                <p className="text-gray-300 text-sm">{gallery.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              className="bg-black/50 border-white/20 text-white hover:bg-white/10"
            >
              <Heart className="w-4 h-4 mr-2" />
              {likes}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="bg-black/50 border-white/20 text-white hover:bg-white/10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* 3D Gallery */}
      <Canvas
        camera={{ position: cameraPosition, fov: 75 }}
        shadows
        style={{ background: 'linear-gradient(to bottom, #0a0a0a, #1a1a2e)' }}
      >
        <SmoothCameraController 
          targetPosition={cameraPosition} 
          selectedArtwork={selectedArtwork}
        />
        
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Gallery Environment */}
        <EnhancedGalleryRoom template={gallery.template} />
        
        {/* Artworks */}
        {gallery.artworks?.map((artwork, index) => {
          const positionData = artworkPositions[index % artworkPositions.length];
          if (!positionData) return null;
          
          return (
            <EnhancedGalleryFrame
              key={artwork.id || index}
              position={positionData.position}
              rotation={positionData.rotation}
              artwork={artwork}
              onClick={handleArtworkClick}
              isSelected={selectedArtwork?.id === artwork.id}
            />
          );
        })}

        {/* Gallery Title */}
        <Text
          position={[0, 8, -12]}
          fontSize={1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {gallery.name}
        </Text>

        {/* Orbit Controls for exploration */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={3}
          maxDistance={20}
        />
      </Canvas>

      {/* Selected Artwork Info */}
      {selectedArtwork && (
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <Card className="bg-black/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {selectedArtwork.title}
                  </h3>
                  {selectedArtwork.description && (
                    <p className="text-gray-300 mb-4">
                      {selectedArtwork.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleBackToGallery}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Back to Gallery
                    </Button>
                    {selectedArtwork.imageUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = selectedArtwork.imageUrl;
                          link.download = selectedArtwork.title || 'artwork';
                          link.click();
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gallery Stats */}
      <div className="absolute bottom-6 right-6 z-10">
        <Card className="bg-black/50 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {gallery.artworks?.length || 0}
              </div>
              <div className="text-sm text-gray-300">Artworks</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

