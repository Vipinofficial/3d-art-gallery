import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';

// Floating particles component
function FloatingParticles({ count = 2000 }) {
  const mesh = useRef();
  const light = useRef();
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp.set([
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      ], i * 3);
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.x = time * 0.1;
      mesh.current.rotation.y = time * 0.05;
    }
    if (light.current) {
      light.current.position.x = Math.sin(time * 0.5) * 10;
      light.current.position.z = Math.cos(time * 0.5) * 10;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.3} />
      <pointLight ref={light} position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
      <Points ref={mesh} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={0.5}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}

// Animated geometric shapes
function AnimatedGeometry() {
  const sphereRef = useRef();
  const boxRef = useRef();
  const torusRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (sphereRef.current) {
      sphereRef.current.position.x = Math.sin(time * 0.5) * 8;
      sphereRef.current.position.y = Math.cos(time * 0.3) * 4;
      sphereRef.current.rotation.x = time * 0.2;
      sphereRef.current.rotation.y = time * 0.3;
    }
    
    if (boxRef.current) {
      boxRef.current.position.x = Math.cos(time * 0.4) * 6;
      boxRef.current.position.z = Math.sin(time * 0.4) * 6;
      boxRef.current.rotation.x = time * 0.4;
      boxRef.current.rotation.z = time * 0.2;
    }
    
    if (torusRef.current) {
      torusRef.current.position.y = Math.sin(time * 0.6) * 3;
      torusRef.current.position.z = Math.cos(time * 0.2) * 8;
      torusRef.current.rotation.x = time * 0.3;
      torusRef.current.rotation.y = time * 0.5;
    }
  });

  return (
    <group>
      <Sphere ref={sphereRef} args={[1, 32, 32]} position={[5, 0, -10]}>
        <meshStandardMaterial
          color="#ec4899"
          transparent
          opacity={0.7}
          wireframe
        />
      </Sphere>
      
      <Box ref={boxRef} args={[1.5, 1.5, 1.5]} position={[-5, 2, -8]}>
        <meshStandardMaterial
          color="#06b6d4"
          transparent
          opacity={0.6}
          wireframe
        />
      </Box>
      
      <Torus ref={torusRef} args={[2, 0.5, 16, 100]} position={[0, -3, -12]}>
        <meshStandardMaterial
          color="#10b981"
          transparent
          opacity={0.8}
          wireframe
        />
      </Torus>
    </group>
  );
}

// Interactive mouse follower
function MouseFollower() {
  const meshRef = useRef();
  const { mouse, viewport } = useThree();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = (mouse.x * viewport.width) / 2;
      meshRef.current.position.y = (mouse.y * viewport.height) / 2;
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.5, 16, 16]} position={[0, 0, -5]}>
      <meshStandardMaterial
        color="#f59e0b"
        transparent
        opacity={0.4}
        emissive="#f59e0b"
        emissiveIntensity={0.2}
      />
    </Sphere>
  );
}

// Spiral galaxy effect
function SpiralGalaxy() {
  const groupRef = useRef();
  const particlesRef = useRef();
  
  const galaxyGeometry = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorInside = new THREE.Color('#8b5cf6');
    const colorOutside = new THREE.Color('#06b6d4');
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Position
      const radius = Math.random() * 20;
      const spinAngle = radius * 5;
      const branchAngle = (i % 3) * ((Math.PI * 2) / 3);
      
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius;
      
      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
      
      // Color
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / 20);
      
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -30]}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={galaxyGeometry.positions.length / 3}
            array={galaxyGeometry.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={galaxyGeometry.colors.length / 3}
            array={galaxyGeometry.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          sizeAttenuation={true}
          depthWrite={false}
          vertexColors={true}
          transparent
          opacity={0.8}
        />
      </points>
    </group>
  );
}

// Main Three.js background component
export default function ThreeBackground() {
  return (
    <div className="three-canvas">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <FloatingParticles />
        <AnimatedGeometry />
        <MouseFollower />
        <SpiralGalaxy />
        
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#8b5cf6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
        <directionalLight position={[0, 10, 5]} intensity={0.3} color="#06b6d4" />
      </Canvas>
    </div>
  );
}

