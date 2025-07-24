"use client"

import { useState, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Plane, Box } from "@react-three/drei"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as THREE from "three"

interface ArtworkDisplayProps {
  artwork: {
    id: string
    title: string
    artist: string
    price: number
    image: string
    likes: number
    position: [number, number, number]
  }
  onSelect: (artwork: any) => void
  onAddToCart: (artwork: any) => void
  onLike: (artworkId: string) => void
}

export function ArtworkDisplay({ artwork, onSelect, onAddToCart, onLike }: ArtworkDisplayProps) {
  const [hovered, setHovered] = useState(false)
  const [liked, setLiked] = useState(false)
  const frameRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (frameRef.current && hovered) {
      frameRef.current.position.z = artwork.position[2] + Math.sin(state.clock.elapsedTime * 2) * 0.02
    }
  })

  const handleLike = () => {
    setLiked(!liked)
    onLike(artwork.id)
  }

  return (
    <group
      ref={frameRef}
      position={artwork.position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Modern Artwork Frame */}
      <Box args={[2.4, 2.4, 0.15]} position={[0, 0, -0.08]} castShadow>
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </Box>

      {/* Inner Frame */}
      <Box args={[2.2, 2.2, 0.1]} position={[0, 0, -0.05]} castShadow>
        <meshStandardMaterial color="#333333" />
      </Box>

      {/* Artwork */}
      <Plane ref={meshRef} args={[2, 2]} onClick={() => onSelect(artwork)}>
        <meshStandardMaterial>
          <primitive object={new THREE.TextureLoader().load(artwork.image)} attach="map" />
        </meshStandardMaterial>
      </Plane>

      {/* Interactive UI Overlay */}
      {hovered && (
        <Html position={[0, 0, 0.1]} center distanceFactor={8} style={{ pointerEvents: "auto" }}>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-gray-200 min-w-[300px]">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{artwork.title}</h3>
                <p className="text-sm text-gray-600">by {artwork.artist}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">${artwork.price}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`p-2 ${liked ? "text-red-500" : "text-gray-500"} hover:text-red-500`}
                  >
                    <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                    <span className="ml-1 text-xs">{artwork.likes + (liked ? 1 : 0)}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelect(artwork)}
                    className="p-2 text-gray-500 hover:text-blue-500"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  onClick={() => onAddToCart(artwork)}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy</span>
                </Button>
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* Artwork Label */}
      <Html position={[0, -1.4, 0]} center>
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-700">
          <div className="text-center">
            <p className="text-sm font-medium text-white">{artwork.title}</p>
            <p className="text-xs text-gray-300">{artwork.artist}</p>
          </div>
        </div>
      </Html>
    </group>
  )
}
