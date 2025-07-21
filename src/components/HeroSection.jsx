import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Float, MeshDistortMaterial } from '@react-three/drei';
import { gsap } from 'gsap';
import { Button } from './ui/button';
import { ArrowRight, Play, Sparkles, Zap } from 'lucide-react';

function FloatingCube({ position, color, scale = 1 }) {
  const mesh = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.x = time * 0.5;
      mesh.current.rotation.y = time * 0.3;
      mesh.current.position.y = position[1] + Math.sin(time + position[0]) * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.6}
          distort={0.3}
          speed={2}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

function HeroText3D() {
  const textRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <Center>
      <Text3D
        ref={textRef}
        font="/fonts/Inter_Bold.json"
        size={2}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        3D
        <MeshDistortMaterial
          color="#00d4ff"
          transparent
          opacity={0.8}
          distort={0.1}
          speed={1}
        />
      </Text3D>
    </Center>
  );
}

function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      
      <FloatingCube position={[-3, 2, 0]} color="#00d4ff" scale={0.8} />
      <FloatingCube position={[3, -1, -2]} color="#8b5cf6" scale={1.2} />
      <FloatingCube position={[0, 3, -3]} color="#ff006e" scale={0.6} />
      <FloatingCube position={[-2, -2, 1]} color="#00ff88" scale={0.9} />
      
      <HeroText3D />
      
      <fog attach="fog" args={['#0a0a1a', 5, 50]} />
    </Canvas>
  );
}

function KineticText({ children, delay = 0, className = '' }) {
  const textRef = useRef();

  useEffect(() => {
    const chars = textRef.current.querySelectorAll('.char');
    
    gsap.fromTo(chars, 
      { 
        y: 100, 
        opacity: 0,
        rotationX: -90,
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 0.8,
        delay: delay,
        stagger: 0.02,
        ease: 'back.out(1.7)',
      }
    );
  }, [delay]);

  const splitText = (text) => {
    return text.split('').map((char, index) => (
      <span key={index} className="char inline-block" style={{ transformOrigin: '50% 100%' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div ref={textRef} className={className}>
      {typeof children === 'string' ? splitText(children) : children}
    </div>
  );
}

function StatCard({ icon: Icon, value, label, delay }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      className="glass-card text-center p-6 hover:shadow-purple-glow transition-all duration-300"
    >
      <Icon className="w-8 h-8 text-electric-blue mx-auto mb-3" />
      <div className="text-2xl font-bold gradient-text mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}

export default function HeroSection({ setActiveSection }) {
  const containerRef = useRef();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.section
      ref={containerRef}
      style={{ y, opacity }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-30">
        <Scene3D />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <KineticText className="text-hero font-black leading-tight mb-4">
            <span className="gradient-text">Ultimate</span>
          </KineticText>
          <KineticText delay={0.5} className="text-hero font-black leading-tight mb-4">
            <span className="glow-text">3D Art Gallery</span>
          </KineticText>
          <KineticText delay={1} className="text-2xl md:text-4xl font-light text-muted-foreground">
            Experience the Future of Digital Art
          </KineticText>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Immerse yourself in cutting-edge virtual galleries powered by WebGL and Three.js. 
          Create, explore, and share breathtaking 3D art experiences that push the boundaries 
          of digital creativity.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button
            size="lg"
            className="magnetic-button bg-gradient-to-r from-electric-blue to-cyber-purple hover:shadow-glow text-lg px-8 py-4 group"
            onClick={() => setActiveSection('create')}
          >
            Start Creating
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="glass-effect border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10 text-lg px-8 py-4 group"
            onClick={() => setActiveSection('explore')}
          >
            <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          <StatCard
            icon={Sparkles}
            value="10K+"
            label="Artworks"
            delay={2.6}
          />
          <StatCard
            icon={Zap}
            value="500+"
            label="Artists"
            delay={2.7}
          />
          <StatCard
            icon={Play}
            value="1M+"
            label="Views"
            delay={2.8}
          />
          <StatCard
            icon={ArrowRight}
            value="99%"
            label="Satisfaction"
            delay={2.9}
          />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-electric-blue/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-electric-blue rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="absolute top-20 left-20 w-20 h-20 border border-electric-blue/20 rounded-full"
        />
        
        <motion.div
          animate={{ 
            rotate: -360,
            y: [0, -20, 0],
          }}
          transition={{ 
            rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="absolute top-40 right-32 w-16 h-16 bg-gradient-to-br from-cyber-purple/20 to-holographic-pink/20 rounded-lg"
        />
        
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
          className="absolute bottom-32 left-32 w-12 h-12 bg-neon-green/30 rounded-full blur-sm"
        />
      </div>
    </motion.section>
  );
}

