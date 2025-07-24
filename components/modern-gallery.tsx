"use client"

import { useRef } from "react"
import { Html, Box, Plane, Cylinder } from "@react-three/drei"
import { ArtworkDisplay } from "./artwork-display"
import type * as THREE from "three"

interface ModernGalleryProps {
  artworks: any[]
  onSelectArtwork: (artwork: any) => void
  onAddToCart: (artwork: any) => void
  onLikeArtwork: (artworkId: string) => void
  galleryName: string
}

export function ModernGallery({
  artworks,
  onSelectArtwork,
  onAddToCart,
  onLikeArtwork,
  galleryName,
}: ModernGalleryProps) {
  const groupRef = useRef<THREE.Group>(null)

  return (
    <group ref={groupRef}>
      {/* Modern Gallery Floor with pattern */}
      <Plane args={[24, 24]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.8} />
      </Plane>

      {/* Floor accent lines */}
      <group>
        {[-8, -4, 0, 4, 8].map((x, i) => (
          <Box key={i} args={[0.05, 0.01, 24]} position={[x, 0.01, 0]}>
            <meshStandardMaterial color="#333333" emissive="#111111" />
          </Box>
        ))}
      </group>

      {/* Modern Gallery Walls with glass effect */}
      <Plane args={[24, 8]} position={[0, 4, -3]} castShadow receiveShadow>
        <meshStandardMaterial color="#f8f9fa" roughness={0.1} metalness={0.1} />
      </Plane>

      <Plane args={[24, 8]} position={[0, 4, 3]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f8f9fa" roughness={0.1} metalness={0.1} />
      </Plane>

      <Plane args={[6, 8]} position={[-12, 4, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f8f9fa" roughness={0.1} metalness={0.1} />
      </Plane>

      <Plane args={[6, 8]} position={[12, 4, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f8f9fa" roughness={0.1} metalness={0.1} />
      </Plane>

      {/* Modern Ceiling with LED strips */}
      <Plane args={[24, 24]} rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <meshStandardMaterial color="#2a2a2a" />
      </Plane>

      {/* LED strip lighting */}
      <group position={[0, 7.8, 0]}>
        {[-6, -2, 2, 6].map((x, i) => (
          <Box key={i} args={[12, 0.1, 0.2]} position={[x, 0, 0]}>
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
          </Box>
        ))}
      </group>

      {/* Modern pedestals for artworks */}
      {artworks.map((artwork, index) => (
        <group key={`pedestal-${artwork.id}`} position={[artwork.position[0], 0, artwork.position[2]]}>
          <Cylinder args={[0.3, 0.3, 0.1]} position={[0, 0.05, 0]}>
            <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
          </Cylinder>
        </group>
      ))}

      {/* Gallery name display */}
      <Html position={[0, 6, -2.8]} center>
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3 border border-gray-700">
          <h1 className="text-2xl font-bold text-white text-center">{galleryName}</h1>
        </div>
      </Html>

      {/* Artworks */}
      {artworks.map((artwork) => (
        <ArtworkDisplay
          key={artwork.id}
          artwork={artwork}
          onSelect={onSelectArtwork}
          onAddToCart={onAddToCart}
          onLike={onLikeArtwork}
        />
      ))}
    </group>
  )
}
