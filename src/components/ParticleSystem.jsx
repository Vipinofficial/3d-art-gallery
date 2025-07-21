import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Individual particle system
function ParticleField({ count = 1000, color = "#8b5cf6", size = 1, speed = 1 }) {
  const mesh = useRef();
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Random positions
      temp[i3] = (Math.random() - 0.5) * 50;
      temp[i3 + 1] = (Math.random() - 0.5) * 50;
      temp[i3 + 2] = (Math.random() - 0.5) * 50;
      
      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02 * speed;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02 * speed;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02 * speed;
    }
    
    return { positions: temp, velocities };
  }, [count, speed]);

  useFrame((state) => {
    if (mesh.current) {
      const positions = mesh.current.geometry.attributes.position.array;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Update positions
        positions[i3] += particles.velocities[i3];
        positions[i3 + 1] += particles.velocities[i3 + 1];
        positions[i3 + 2] += particles.velocities[i3 + 2];
        
        // Wrap around boundaries
        if (Math.abs(positions[i3]) > 25) positions[i3] *= -1;
        if (Math.abs(positions[i3 + 1]) > 25) positions[i3 + 1] *= -1;
        if (Math.abs(positions[i3 + 2]) > 25) positions[i3 + 2] *= -1;
      }
      
      mesh.current.geometry.attributes.position.needsUpdate = true;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Points ref={mesh} positions={particles.positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Interconnected particle network
function ParticleNetwork({ count = 200 }) {
  const meshRef = useRef();
  const linesRef = useRef();
  
  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const connections = [];
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;
      
      velocities[i3] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    
    return { positions, velocities, connections };
  }, [count]);

  useFrame(() => {
    if (meshRef.current && linesRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array;
      const linePositions = [];
      
      // Update particle positions
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        positions[i3] += particleData.velocities[i3];
        positions[i3 + 1] += particleData.velocities[i3 + 1];
        positions[i3 + 2] += particleData.velocities[i3 + 2];
        
        // Boundary wrapping
        if (Math.abs(positions[i3]) > 15) particleData.velocities[i3] *= -1;
        if (Math.abs(positions[i3 + 1]) > 15) particleData.velocities[i3 + 1] *= -1;
        if (Math.abs(positions[i3 + 2]) > 15) particleData.velocities[i3 + 2] *= -1;
      }
      
      // Create connections between nearby particles
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const pos1 = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
        
        for (let j = i + 1; j < count; j++) {
          const j3 = j * 3;
          const pos2 = new THREE.Vector3(positions[j3], positions[j3 + 1], positions[j3 + 2]);
          const distance = pos1.distanceTo(pos2);
          
          if (distance < 5) {
            linePositions.push(pos1.x, pos1.y, pos1.z);
            linePositions.push(pos2.x, pos2.y, pos2.z);
          }
        }
      }
      
      meshRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Update line geometry
      if (linePositions.length > 0) {
        linesRef.current.geometry.setFromPoints(
          linePositions.reduce((acc, val, i) => {
            if (i % 3 === 0) acc.push(new THREE.Vector3(val, linePositions[i + 1], linePositions[i + 2]));
            return acc;
          }, [])
        );
      }
    }
  });

  return (
    <group>
      <Points ref={meshRef} positions={particleData.positions} stride={3}>
        <PointMaterial
          transparent
          color="#06b6d4"
          size={2}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
      
      <line ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.3}
        />
      </line>
    </group>
  );
}

// DNA helix particle effect
function DNAHelix() {
  const groupRef = useRef();
  
  const helixData = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const color1 = new THREE.Color('#8b5cf6');
    const color2 = new THREE.Color('#ec4899');
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const t = (i / count) * Math.PI * 8;
      const radius = 3;
      
      // First helix
      if (i < count / 2) {
        positions[i3] = Math.cos(t) * radius;
        positions[i3 + 1] = (i / count) * 20 - 10;
        positions[i3 + 2] = Math.sin(t) * radius;
        
        colors[i3] = color1.r;
        colors[i3 + 1] = color1.g;
        colors[i3 + 2] = color1.b;
      } else {
        // Second helix (offset)
        const offset = Math.PI;
        positions[i3] = Math.cos(t + offset) * radius;
        positions[i3 + 1] = ((i - count / 2) / (count / 2)) * 20 - 10;
        positions[i3 + 2] = Math.sin(t + offset) * radius;
        
        colors[i3] = color2.r;
        colors[i3 + 1] = color2.g;
        colors[i3 + 2] = color2.b;
      }
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 2;
    }
  });

  return (
    <group ref={groupRef} position={[15, 0, -10]}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={helixData.positions.length / 3}
            array={helixData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={helixData.colors.length / 3}
            array={helixData.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={3}
          sizeAttenuation={true}
          depthWrite={false}
          vertexColors={true}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Main particle system component
export default function ParticleSystem() {
  return (
    <div className="particles-container">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ParticleField count={800} color="#8b5cf6" size={1.5} speed={0.5} />
        <ParticleField count={600} color="#ec4899" size={1} speed={0.8} />
        <ParticleField count={400} color="#06b6d4" size={2} speed={0.3} />
        <ParticleNetwork count={150} />
        <DNAHelix />
        
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.3} color="#8b5cf6" />
      </Canvas>
    </div>
  );
}

