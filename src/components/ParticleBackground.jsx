import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField({ count = 3000 }) {
  const mesh = useRef();
  const light = useRef();
  
  // Generate random particle positions
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      temp[i3] = (Math.random() - 0.5) * 100;
      temp[i3 + 1] = (Math.random() - 0.5) * 100;
      temp[i3 + 2] = (Math.random() - 0.5) * 100;
    }
    return temp;
  }, [count]);

  // Animate particles
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (mesh.current) {
      mesh.current.rotation.x = time * 0.05;
      mesh.current.rotation.y = time * 0.075;
      
      // Update particle positions for floating effect
      const positions = mesh.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + positions[i] * 0.01) * 0.01;
      }
      mesh.current.geometry.attributes.position.needsUpdate = true;
    }
    
    if (light.current) {
      light.current.position.x = Math.sin(time * 0.5) * 30;
      light.current.position.z = Math.cos(time * 0.5) * 30;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.2} />
      <pointLight ref={light} position={[10, 10, 10]} intensity={1} color="#00d4ff" />
      <Points ref={mesh} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00d4ff"
          size={0.8}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function FloatingGeometry() {
  const mesh = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.x = time * 0.2;
      mesh.current.rotation.y = time * 0.1;
      mesh.current.position.y = Math.sin(time * 0.5) * 2;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, -20]}>
      <torusKnotGeometry args={[3, 1, 128, 16]} />
      <meshStandardMaterial
        color="#8b5cf6"
        transparent
        opacity={0.3}
        wireframe
      />
    </mesh>
  );
}

function GalaxySpiral() {
  const points = useRef();
  
  const spiralPositions = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 50;
      const spinAngle = radius * 0.1;
      const branchAngle = (i % 3) * (Math.PI * 2) / 3;
      
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
      
      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
      
      // Color based on distance from center
      const mixedColor = new THREE.Color();
      mixedColor.lerpColors(
        new THREE.Color('#ff006e'),
        new THREE.Color('#00d4ff'),
        radius / 50
      );
      
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    
    return { positions, colors };
  }, []);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (points.current) {
      points.current.rotation.y = time * 0.02;
    }
  });

  return (
    <points ref={points} position={[0, 0, -30]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={spiralPositions.positions.length / 3}
          array={spiralPositions.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={spiralPositions.colors.length / 3}
          array={spiralPositions.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleBackground() {
  return (
    <div className="particle-bg">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ParticleField count={3000} />
        <FloatingGeometry />
        <GalaxySpiral />
        <fog attach="fog" args={['#0a0a1a', 50, 200]} />
      </Canvas>
    </div>
  );
}

