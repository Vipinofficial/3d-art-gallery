import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Box, Plane, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

// Gallery frame component
function GalleryFrame({ position, rotation, imageUrl, title, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState(null);
  
  // Load texture properly with error handling
  useEffect(() => {
    if (imageUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(
        imageUrl,
        (loadedTexture) => {
          loadedTexture.flipY = false;
          setTexture(loadedTexture);
        },
        undefined,
        (error) => {
          console.warn('Failed to load texture:', imageUrl, error);
          setTexture(null);
        }
      );
    }
  }, [imageUrl]);

  useFrame((state) => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      if (hovered) {
        meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 2) * 0.1 + position[2];
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
      onClick={onClick}
    >
      {/* Frame */}
      <Box args={[4.2, 3.2, 0.2]} position={[0, 0, -0.1]}>
        <meshStandardMaterial color="#2a2a2a" />
      </Box>
      
      {/* Artwork */}
      <Plane args={[4, 3]}>
        {texture ? (
          <meshStandardMaterial map={texture} />
        ) : (
          <meshStandardMaterial color="#4a5568">
            {/* Placeholder pattern */}
            <primitive object={(() => {
              const canvas = document.createElement('canvas');
              canvas.width = 512;
              canvas.height = 512;
              const ctx = canvas.getContext('2d');
              
              // Create a gradient background
              const gradient = ctx.createLinearGradient(0, 0, 512, 512);
              gradient.addColorStop(0, '#8b5cf6');
              gradient.addColorStop(1, '#ec4899');
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, 512, 512);
              
              // Add some geometric shapes
              ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
              ctx.fillRect(100, 100, 312, 312);
              ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
              ctx.fillRect(150, 150, 212, 212);
              
              const placeholderTexture = new THREE.CanvasTexture(canvas);
              return placeholderTexture;
            })()} attach="map" />
          </meshStandardMaterial>
        )}
      </Plane>
      
      {/* Title */}
      {title && (
        <Text
          position={[0, -2, 0.1]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text>
      )}
      
      {/* Glow effect when hovered */}
      {hovered && (
        <Plane args={[4.5, 3.5]} position={[0, 0, -0.05]}>
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.3}
          />
        </Plane>
      )}
    </group>
  );
}

// Gallery room environment
function GalleryRoom() {
  return (
    <group>
      {/* Floor */}
      <Plane args={[50, 50]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Plane>
      
      {/* Walls */}
      <Plane args={[50, 20]} position={[0, 5, -25]}>
        <meshStandardMaterial color="#2a2a2a" />
      </Plane>
      
      <Plane args={[50, 20]} rotation={[0, Math.PI / 2, 0]} position={[-25, 5, 0]}>
        <meshStandardMaterial color="#2a2a2a" />
      </Plane>
      
      <Plane args={[50, 20]} rotation={[0, -Math.PI / 2, 0]} position={[25, 5, 0]}>
        <meshStandardMaterial color="#2a2a2a" />
      </Plane>
      
      {/* Ceiling */}
      <Plane args={[50, 50]} rotation={[Math.PI / 2, 0, 0]} position={[0, 15, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Plane>
    </group>
  );
}

// Camera controller for smooth movement
function CameraController({ targetPosition }) {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(...targetPosition), 0.05);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// Lighting setup for gallery
function GalleryLighting() {
  return (
    <group>
      <ambientLight intensity={0.3} />
      
      {/* Spotlight for each artwork */}
      <spotLight
        position={[0, 10, 5]}
        angle={0.3}
        penumbra={0.5}
        intensity={1}
        color="#ffffff"
        target-position={[0, 0, 0]}
      />
      
      <spotLight
        position={[-8, 10, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={1}
        color="#ffffff"
        target-position={[-8, 0, 0]}
      />
      
      <spotLight
        position={[8, 10, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={1}
        color="#ffffff"
        target-position={[8, 0, 0]}
      />
      
      {/* Accent lighting */}
      <pointLight position={[0, 8, 10]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[-15, 8, -10]} intensity={0.3} color="#ec4899" />
      <pointLight position={[15, 8, -10]} intensity={0.3} color="#06b6d4" />
    </group>
  );
}

// Main interactive gallery component
export default function InteractiveGallery({ artworks = [], onArtworkClick }) {
  const [cameraPosition, setCameraPosition] = useState([0, 2, 10]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  // Default artworks if none provided
  const defaultArtworks = [
    { id: 1, title: "Digital Dreams", position: [0, 2, -5] },
    { id: 2, title: "Neon Nights", position: [-8, 2, -3] },
    { id: 3, title: "Cyber Visions", position: [8, 2, -3] },
    { id: 4, title: "Future Landscapes", position: [-6, 2, 5] },
    { id: 5, title: "Abstract Reality", position: [6, 2, 5] },
  ];

  const displayArtworks = artworks.length > 0 ? artworks : defaultArtworks;

  const handleArtworkClick = (artwork) => {
    setSelectedArtwork(artwork);
    setCameraPosition([artwork.position[0], artwork.position[1], artwork.position[2] + 3]);
    if (onArtworkClick) {
      onArtworkClick(artwork);
    }
  };

  const resetCamera = () => {
    setCameraPosition([0, 2, 10]);
    setSelectedArtwork(null);
  };

  return (
    <div className="w-full h-screen relative">
      <Canvas
        camera={{ position: cameraPosition, fov: 75 }}
        style={{ background: 'linear-gradient(to bottom, #0a0a0a, #1a1a2e)' }}
      >
        <CameraController targetPosition={cameraPosition} />
        <GalleryLighting />
        <GalleryRoom />
        
        {displayArtworks.map((artwork, index) => (
          <GalleryFrame
            key={artwork.id || index}
            position={artwork.position}
            rotation={[0, 0, 0]}
            imageUrl={artwork.imageUrl}
            title={artwork.title}
            onClick={() => handleArtworkClick(artwork)}
          />
        ))}
        
        {/* Interactive UI overlay */}
        <Html position={[0, 8, 0]} center>
          <div className="text-white text-center pointer-events-none">
            <h2 className="text-2xl font-bold mb-2">Virtual Art Gallery</h2>
            <p className="text-sm opacity-75">Click on artworks to explore</p>
          </div>
        </Html>
        
        {selectedArtwork && (
          <Html position={[selectedArtwork.position[0], selectedArtwork.position[1] + 3, selectedArtwork.position[2]]} center>
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white max-w-xs">
              <h3 className="font-bold text-lg mb-2">{selectedArtwork.title}</h3>
              <p className="text-sm opacity-75 mb-3">
                {selectedArtwork.description || "A stunning piece of digital art that captures the essence of modern creativity."}
              </p>
              <button
                onClick={resetCamera}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Back to Gallery
              </button>
            </div>
          </Html>
        )}
      </Canvas>
      
      {/* Navigation controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={resetCamera}
          className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
        >
          Reset View
        </button>
        <button
          onClick={() => setCameraPosition([0, 8, 0])}
          className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
        >
          Top View
        </button>
      </div>
    </div>
  );
}

