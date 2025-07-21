import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Plane, Box, Environment, PerspectiveCamera, Float, Sparkles, EffectComposer, Bloom, DepthOfField } from '@react-three/drei';
import { EffectComposer as PostProcessingComposer, RenderPass, UnrealBloomPass } from 'three/examples/jsm/postprocessing/EffectComposer';
import * as THREE from 'three';
import gsap from 'gsap';

// Gallery Room Component with Enhanced Features
function GalleryRoom({ template, artworks = [] }) {
  const { wallColor, floorColor, layout, lightingType } = template;
  const { dimensions } = layout;
  const roomRef = useRef();

  // Animate room entrance
  useEffect(() => {
    if (roomRef.current) {
      gsap.fromTo(roomRef.current.scale, 
        { x: 0.8, y: 0.8, z: 0.8 },
        { x: 1, y: 1, z: 1, duration: 1.5, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <group ref={roomRef}>
      {/* Enhanced Floor with Reflections */}
      <Plane
        args={[dimensions.width, dimensions.depth]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={floorColor} 
          roughness={0.1}
          metalness={0.1}
          envMapIntensity={0.5}
        />
      </Plane>

      {/* Enhanced Walls with Better Materials */}
      {/* Front Wall */}
      <Plane
        args={[dimensions.width, dimensions.height]}
        position={[0, dimensions.height / 2, dimensions.depth / 2]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={wallColor} 
          roughness={0.8}
          metalness={0.0}
        />
      </Plane>

      {/* Back Wall */}
      <Plane
        args={[dimensions.width, dimensions.height]}
        position={[0, dimensions.height / 2, -dimensions.depth / 2]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={wallColor} 
          roughness={0.8}
          metalness={0.0}
        />
      </Plane>

      {/* Left Wall */}
      <Plane
        args={[dimensions.depth, dimensions.height]}
        position={[-dimensions.width / 2, dimensions.height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={wallColor} 
          roughness={0.8}
          metalness={0.0}
        />
      </Plane>

      {/* Right Wall */}
      <Plane
        args={[dimensions.depth, dimensions.height]}
        position={[dimensions.width / 2, dimensions.height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={wallColor} 
          roughness={0.8}
          metalness={0.0}
        />
      </Plane>

      {/* Enhanced Ceiling */}
      <Plane
        args={[dimensions.width, dimensions.depth]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, dimensions.height, 0]}
      >
        <meshStandardMaterial 
          color="#ffffff" 
          roughness={0.9}
          metalness={0.0}
        />
      </Plane>

      {/* Dynamic Lighting based on template */}
      <DynamicLighting lightingType={lightingType} dimensions={dimensions} />

      {/* Ambient Particles */}
      <Sparkles
        count={50}
        scale={[dimensions.width, dimensions.height, dimensions.depth]}
        size={2}
        speed={0.3}
        opacity={0.1}
        color="#ffffff"
      />

      {/* Render Enhanced Artworks */}
      {artworks.map((artwork, index) => (
        <EnhancedArtworkDisplay
          key={artwork.artId || index}
          artwork={artwork}
          position={artwork.position}
          index={index}
        />
      ))}
    </group>
  );
}

// Dynamic Lighting Component
function DynamicLighting({ lightingType, dimensions }) {
  const lightRef = useRef();
  
  useFrame((state) => {
    if (lightRef.current && lightingType === 'dramatic') {
      // Animate dramatic lighting
      lightRef.current.intensity = 0.8 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group>
      {lightingType === 'spot' && (
        <>
          <spotLight
            ref={lightRef}
            position={[0, dimensions.height - 2, 0]}
            angle={Math.PI / 6}
            penumbra={0.5}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <spotLight
            position={[dimensions.width / 4, dimensions.height - 2, dimensions.depth / 4]}
            angle={Math.PI / 8}
            penumbra={0.3}
            intensity={0.6}
            castShadow
          />
        </>
      )}
      
      {lightingType === 'warm' && (
        <>
          <pointLight
            position={[0, dimensions.height - 1, 0]}
            intensity={0.8}
            color="#ffd700"
            castShadow
          />
          <pointLight
            position={[dimensions.width / 3, dimensions.height - 2, 0]}
            intensity={0.5}
            color="#ffb347"
          />
          <pointLight
            position={[-dimensions.width / 3, dimensions.height - 2, 0]}
            intensity={0.5}
            color="#ffb347"
          />
        </>
      )}
      
      {lightingType === 'dramatic' && (
        <>
          <spotLight
            ref={lightRef}
            position={[dimensions.width / 2, dimensions.height, -dimensions.depth / 3]}
            angle={Math.PI / 4}
            penumbra={0.8}
            intensity={1.2}
            color="#ffffff"
            castShadow
          />
          <pointLight
            position={[-dimensions.width / 3, dimensions.height / 2, dimensions.depth / 3]}
            intensity={0.3}
            color="#4169e1"
          />
        </>
      )}
      
      {lightingType === 'ambient' && (
        <>
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[dimensions.width / 2, dimensions.height, dimensions.depth / 2]}
            intensity={0.8}
            castShadow
          />
        </>
      )}
    </group>
  );
}

// Enhanced Individual Artwork Display Component
function EnhancedArtworkDisplay({ artwork, position, index }) {
  const meshRef = useRef();
  const frameRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState(null);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const imageUrl = artwork.image || artwork.imageUrl;
    if (imageUrl) {
      const loader = new THREE.TextureLoader();
      // Handle both file paths and data URLs
      if (imageUrl.startsWith('data:') || imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
        loader.load(imageUrl, (loadedTexture) => {
          setTexture(loadedTexture);
        }, undefined, (error) => {
          console.warn('Failed to load texture:', imageUrl, error);
          // Fallback to a default color
          setTexture(null);
        });
      } else {
        // For local file paths, try to convert to a usable URL
        try {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL();
            
            loader.load(dataUrl, (loadedTexture) => {
              setTexture(loadedTexture);
            });
          };
          img.onerror = () => {
            console.warn('Failed to load image:', imageUrl);
            setTexture(null);
          };
          img.src = imageUrl;
        } catch (error) {
          console.warn('Error processing image:', imageUrl, error);
          setTexture(null);
        }
      }
    }
  }, [artwork.image, artwork.imageUrl]);

  // Entrance animation with staggered delay
  useEffect(() => {
    if (meshRef.current) {
      gsap.fromTo(meshRef.current.position,
        { y: position.y - 2, z: position.z - 1 },
        { 
          y: position.y, 
          z: position.z, 
          duration: 1.2, 
          delay: index * 0.2,
          ease: 'back.out(1.7)' 
        }
      );
      
      gsap.fromTo(meshRef.current.rotation,
        { y: Math.PI },
        { 
          y: 0, 
          duration: 1.5, 
          delay: index * 0.2,
          ease: 'power2.out' 
        }
      );
    }
  }, [position, index]);

  // Hover animations
  useEffect(() => {
    if (frameRef.current) {
      if (hovered) {
        gsap.to(frameRef.current.scale, {
          x: 1.05,
          y: 1.05,
          z: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(frameRef.current.position, {
          z: position.z + 0.2,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(frameRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(frameRef.current.position, {
          z: position.z,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
  }, [hovered, position.z]);

  // Click animation
  const handleClick = () => {
    setClicked(true);
    if (meshRef.current) {
      gsap.to(meshRef.current.rotation, {
        y: Math.PI * 2,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => setClicked(false)
      });
    }
  };

  const frameWidth = (artwork.dimensions?.width || 60) / 10;
  const frameHeight = (artwork.dimensions?.height || 48) / 10;

  return (
    <Float
      speed={1}
      rotationIntensity={0.1}
      floatIntensity={0.1}
      floatingRange={[0, 0.1]}
    >
      <group 
        ref={meshRef}
        position={[position.x, position.y, position.z]}
      >
        {/* Enhanced Artwork Frame with Lighting */}
        <group ref={frameRef}>
          <Box
            args={[frameWidth + 0.3, frameHeight + 0.3, 0.15]}
            position={[0, 0, -0.075]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial 
              color="#8B4513" 
              roughness={0.3}
              metalness={0.7}
            />
          </Box>

          {/* Artwork Canvas with Enhanced Materials */}
          <Plane
            args={[frameWidth, frameHeight]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={handleClick}
            castShadow
          >
            {texture ? (
              <meshStandardMaterial 
                map={texture} 
                roughness={0.1}
                metalness={0.0}
                emissive={hovered ? "#111111" : "#000000"}
              />
            ) : (
              <meshStandardMaterial 
                color="#f0f0f0" 
                roughness={0.8}
                metalness={0.0}
              />
            )}
          </Plane>

          {/* Spotlight for each artwork */}
          <spotLight
            position={[0, 2, 1]}
            angle={Math.PI / 6}
            penumbra={0.5}
            intensity={hovered ? 1.5 : 0.8}
            target={meshRef.current}
            castShadow
          />
        </group>

        {/* Enhanced Artwork Info with 3D Text */}
        {hovered && (
          <group position={[0, -frameHeight / 2 - 1.5, 0.8]}>
            <Text
              fontSize={0.6}
              color="#333333"
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter-bold.woff"
              outlineWidth={0.02}
              outlineColor="#ffffff"
            >
              {artwork.title}
            </Text>
            <Text
              fontSize={0.4}
              color="#666666"
              anchorX="center"
              anchorY="middle"
              position={[0, -0.8, 0]}
              font="/fonts/inter-regular.woff"
            >
              {artwork.artist} - ${artwork.price}
            </Text>
            {artwork.sold && (
              <Text
                fontSize={0.5}
                color="#ff0000"
                anchorX="center"
                anchorY="middle"
                position={[0, -1.4, 0]}
                font="/fonts/inter-bold.woff"
                outlineWidth={0.02}
                outlineColor="#ffffff"
              >
                SOLD
              </Text>
            )}
          </group>
        )}

        {/* Enhanced Sold Overlay with Animation */}
        {artwork.sold && (
          <Plane
            args={[frameWidth, frameHeight]}
            position={[0, 0, 0.02]}
          >
            <meshStandardMaterial 
              color="#ff0000" 
              transparent 
              opacity={0.4}
              roughness={0.1}
              metalness={0.8}
            />
          </Plane>
        )}

        {/* Particle effect for featured artworks */}
        {artwork.featured && !artwork.sold && (
          <Sparkles
            count={20}
            scale={[frameWidth + 1, frameHeight + 1, 1]}
            size={3}
            speed={0.5}
            opacity={0.6}
            color="#ffd700"
          />
        )}
      </group>
    </Float>
  );
}

// Enhanced First Person Controls Component with GSAP
function EnhancedFirstPersonControls({ enabled = true }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const [isMoving, setIsMoving] = useState(false);
  
  useFrame(() => {
    if (controlsRef.current && enabled) {
      controlsRef.current.update();
    }
  });

  // Smooth camera transitions with GSAP
  const smoothCameraMove = (targetPosition, targetLookAt) => {
    if (isMoving) return;
    
    setIsMoving(true);
    
    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 2,
      ease: 'power2.inOut',
      onComplete: () => setIsMoving(false)
    });
    
    if (controlsRef.current && targetLookAt) {
      gsap.to(controlsRef.current.target, {
        x: targetLookAt.x,
        y: targetLookAt.y,
        z: targetLookAt.z,
        duration: 2,
        ease: 'power2.inOut'
      });
    }
  };

  // Keyboard controls for smooth movement
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!enabled) return;
      
      const moveDistance = 3;
      const currentPos = camera.position;
      
      switch(event.key.toLowerCase()) {
        case 'w':
          smoothCameraMove(
            { x: currentPos.x, y: currentPos.y, z: currentPos.z - moveDistance },
            null
          );
          break;
        case 's':
          smoothCameraMove(
            { x: currentPos.x, y: currentPos.y, z: currentPos.z + moveDistance },
            null
          );
          break;
        case 'a':
          smoothCameraMove(
            { x: currentPos.x - moveDistance, y: currentPos.y, z: currentPos.z },
            null
          );
          break;
        case 'd':
          smoothCameraMove(
            { x: currentPos.x + moveDistance, y: currentPos.y, z: currentPos.z },
            null
          );
          break;
        case '1':
          // Preset view 1: Overview
          smoothCameraMove(
            { x: 0, y: 8, z: 15 },
            { x: 0, y: 2, z: 0 }
          );
          break;
        case '2':
          // Preset view 2: Close-up
          smoothCameraMove(
            { x: 5, y: 2, z: 8 },
            { x: 0, y: 2, z: 0 }
          );
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [camera, enabled, isMoving]);

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      maxPolarAngle={Math.PI / 2}
      minDistance={2}
      maxDistance={25}
      target={[0, 2, 0]}
      enableDamping={true}
      dampingFactor={0.05}
    />
  );
}

// Main Enhanced Gallery 3D Component
export default function Gallery3D({ 
  template, 
  artworks = [], 
  onArtworkClick,
  walkingMode = true 
}) {
  const [cameraPosition, setCameraPosition] = useState([0, 2, 10]);
  const [showControls, setShowControls] = useState(true);

  // Hide controls after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen bg-gray-900 relative">
      <Canvas
        camera={{ 
          position: cameraPosition, 
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          shadowMap: true,
          shadowMapType: THREE.PCFSoftShadowMap,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />

          {/* Environment and Post-Processing */}
          <Environment preset="studio" />
          
          {/* Gallery Room */}
          <GalleryRoom template={template} artworks={artworks} />

          {/* Enhanced Controls */}
          <EnhancedFirstPersonControls enabled={walkingMode} />

          {/* Post-Processing Effects */}
          <EffectComposer>
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.9}
            />
            <DepthOfField
              focusDistance={0.02}
              focalLength={0.005}
              bokehScale={3}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Enhanced UI Overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg backdrop-blur-sm">
        <h3 className="text-lg font-bold mb-2">{template.name}</h3>
        <p className="text-sm mb-3">{template.description}</p>
        
        {showControls && (
          <div className="text-xs space-y-1 border-t border-gray-600 pt-2">
            <p className="font-semibold">Navigation Controls:</p>
            <p>🖱️ Mouse: Look around & zoom</p>
            <p>⌨️ WASD: Move around</p>
            <p>⌨️ 1: Overview • 2: Close-up</p>
            <p>🖱️ Click artworks for details</p>
          </div>
        )}
      </div>

      {/* Enhanced Gallery Stats */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg backdrop-blur-sm">
        <div className="text-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Artworks: {artworks.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Available: {artworks.filter(art => !art.sold).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Sold: {artworks.filter(art => art.sold).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Featured: {artworks.filter(art => art.featured && !art.sold).length}</span>
          </div>
        </div>
      </div>

      {/* Performance Monitor */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-xs">
        WebGL • Three.js • GSAP Enhanced
      </div>

      {/* Toggle Controls Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
      >
        {showControls ? 'Hide Controls' : 'Show Controls'}
      </button>
    </div>
  );
}

