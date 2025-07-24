"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import type * as THREE from "three"

interface FloatingLabelProps {
  text: string
  position: [number, number, number]
  color?: string
  onClick?: () => void
}

export function FloatingLabel({ text, position, color = "#6366f1", onClick }: FloatingLabelProps) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.1
    }
  })

  return (
    <group ref={ref} position={position}>
      <Html center>
        <div
          className={`px-4 py-2 rounded-full shadow-lg border-2 backdrop-blur-sm cursor-pointer transition-all hover:scale-105 ${
            onClick ? "hover:shadow-xl" : ""
          }`}
          style={{
            backgroundColor: `${color}20`,
            borderColor: color,
            color: color,
          }}
          onClick={onClick}
        >
          <span className="font-medium text-sm">{text}</span>
        </div>
      </Html>
    </group>
  )
}
