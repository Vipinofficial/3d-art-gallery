"use client"

import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls, Float, Text3D, Box, Sphere } from "@react-three/drei"
import { Suspense, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Palette, Upload, Eye, ShoppingCart, Shield, Zap } from "lucide-react"
import type * as THREE from "three"

interface LandingPageProps {
  onLogin: () => void
  onSignup: () => void
}

function FloatingArtwork({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Box ref={meshRef} args={[1.5, 1.5, 0.1]} position={position}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </Box>
    </Float>
  )
}

function AnimatedSphere({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.5
    }
  })

  return (
    <Sphere ref={meshRef} args={[0.3]} position={position}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
    </Sphere>
  )
}

export function LandingPage({ onLogin, onSignup }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section with 3D Background */}
      <div className="relative h-screen overflow-hidden">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }} className="absolute inset-0">
          <Suspense fallback={null}>
            <Environment preset="night" />
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />

            {/* Floating 3D Elements */}
            <FloatingArtwork position={[-4, 2, -2]} color="#6366f1" />
            <FloatingArtwork position={[4, -1, -3]} color="#8b5cf6" />
            <FloatingArtwork position={[-2, -2, -1]} color="#06b6d4" />
            <FloatingArtwork position={[3, 3, -4]} color="#f59e0b" />

            <AnimatedSphere position={[-6, 0, -5]} color="#ec4899" />
            <AnimatedSphere position={[6, 2, -6]} color="#10b981" />
            <AnimatedSphere position={[0, -3, -3]} color="#f97316" />

            {/* 3D Text */}
            <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
              <Text3D font="/fonts/Geist_Bold.json" size={0.8} height={0.1} position={[-3, 1, 0]}>
                ArtVerse
                <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
              </Text3D>
            </Float>

            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          </Suspense>
        </Canvas>

        {/* Hero Content Overlay */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center max-w-4xl mx-auto px-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                ArtVerse 3D
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                Step into the future of digital art galleries. Create, showcase, and sell your masterpieces in stunning
                3D environments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={onSignup}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all"
                >
                  Start Creating
                </Button>
                <Button
                  onClick={onLogin}
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm bg-transparent"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why Choose ArtVerse?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the next generation of digital art galleries with cutting-edge 3D technology and secure
              blockchain integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Palette className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">3D Galleries</h3>
                <p className="text-gray-300">
                  Create immersive 3D galleries that showcase your art in stunning virtual environments with realistic
                  lighting and shadows.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Secure Trading</h3>
                <p className="text-gray-300">
                  Advanced security measures protect your digital assets with encrypted transactions and secure payment
                  processing.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Instant Upload</h3>
                <p className="text-gray-300">
                  Upload your artwork instantly with support for multiple formats and automatic optimization for 3D
                  display.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-xl text-gray-300">Start selling your digital art in just three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">1. Upload Your Art</h3>
              <p className="text-gray-300">
                Create your account and upload your digital artworks. Support for images, 3D models, and interactive
                media.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">2. Create Your Gallery</h3>
              <p className="text-gray-300">
                Design your personalized 3D gallery space. Choose layouts, lighting, and themes that match your artistic
                vision.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">3. Start Selling</h3>
              <p className="text-gray-300">
                Set your prices and start selling. Our secure payment system handles transactions while you focus on
                creating.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">1000+</div>
              <div className="text-gray-300 text-lg">Artists</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">5000+</div>
              <div className="text-gray-300 text-lg">Artworks</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">$2M+</div>
              <div className="text-gray-300 text-lg">Sales Volume</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Showcase Your Art?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of artists already selling their work in immersive 3D galleries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onSignup}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all"
            >
              Get Started Free
            </Button>
            <Button
              onClick={onLogin}
              variant="outline"
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-4 text-lg font-semibold rounded-full backdrop-blur-sm bg-transparent"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
