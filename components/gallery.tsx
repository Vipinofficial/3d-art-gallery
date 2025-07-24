"use client"

import { useRef } from "react"
import { Html, Box, Plane } from "@react-three/drei"
import { ArtworkDisplay } from "./artwork-display"
import { FloatingLabel } from "./floating-label"
import type * as THREE from "three"

interface GalleryProps {
  onSelectArtwork: (artwork: any) => void
  onAddToCart: (artwork: any) => void
  onLikeArtwork: (artworkId: string) => void
  onNavigateToCreator: () => void
}

const artworks = [
  {
    id: "1",
    title: "Digital Dreams",
    artist: "Alex Chen",
    price: 299,
    image: "/placeholder.svg?height=400&width=400",
    likes: 42,
    position: [-4, 1.5, -2.9],
  },
  {
    id: "2",
    title: "Neon Cityscape",
    artist: "Maya Rodriguez",
    price: 450,
    image: "/placeholder.svg?height=400&width=400",
    likes: 67,
    position: [0, 1.5, -2.9],
  },
  {
    id: "3",
    title: "Ocean Waves",
    artist: "David Kim",
    price: 350,
    image: "/placeholder.svg?height=400&width=400",
    likes: 28,
    position: [4, 1.5, -2.9],
  },
  {
    id: "4",
    title: "Forest Meditation",
    artist: "Sarah Johnson",
    price: 275,
    image: "/placeholder.svg?height=400&width=400",
    likes: 35,
    position: [-2, 1.5, 2.9],
  },
  {
    id: "5",
    title: "Cosmic Journey",
    artist: "Michael Brown",
    price: 520,
    image: "/placeholder.svg?height=400&width=400",
    likes: 89,
    position: [2, 1.5, 2.9],
  },
]

export function Gallery({ onSelectArtwork, onAddToCart, onLikeArtwork, onNavigateToCreator }: GalleryProps) {
  const groupRef = useRef<THREE.Group>(null)

  return (
    <group ref={groupRef}>
      {/* Gallery Floor */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <meshLambertMaterial color="#f8f9fa" />
      </Plane>

      {/* Gallery Walls */}
      <Plane args={[20, 6]} position={[0, 3, -3]} castShadow receiveShadow>
        <meshLambertMaterial color="#ffffff" />
      </Plane>

      <Plane args={[20, 6]} position={[0, 3, 3]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <meshLambertMaterial color="#ffffff" />
      </Plane>

      <Plane args={[6, 6]} position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <meshLambertMaterial color="#ffffff" />
      </Plane>

      <Plane args={[6, 6]} position={[10, 3, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
        <meshLambertMaterial color="#ffffff" />
      </Plane>

      {/* Ceiling */}
      <Plane args={[20, 20]} rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
        <meshLambertMaterial color="#f1f3f4" />
      </Plane>

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

      {/* Floating Labels */}
      <FloatingLabel text="Shop Now" position={[0, 4, 0]} color="#6366f1" />

      <FloatingLabel text="Creator Portal" position={[6, 2.5, 0]} color="#10b981" onClick={onNavigateToCreator} />

      {/* Navigation Path to Creator Portal */}
      <group position={[6, 0.1, 0]}>
        <Box args={[2, 0.1, 0.5]} castShadow>
          <meshLambertMaterial color="#e5e7eb" />
        </Box>
        <Html position={[0, 0.2, 0]} center>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-700">→ Creator Zone</span>
          </div>
        </Html>
      </group>
    </group>
  )
}
