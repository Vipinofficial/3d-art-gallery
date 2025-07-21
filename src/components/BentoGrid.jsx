import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { 
  Palette, 
  Zap, 
  Globe, 
  BarChart3, 
  Sparkles, 
  Users, 
  Heart,
  TrendingUp,
  Eye,
  Download
} from 'lucide-react';

function InteractiveSphere({ color }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.3;
      meshRef.current.rotation.y = time * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.8}
          distort={0.4}
          speed={2}
          roughness={0.1}
        />
      </Sphere>
    </Float>
  );
}

function Scene3D({ color = "#00d4ff" }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <InteractiveSphere color={color} />
    </Canvas>
  );
}

function TiltCard({ children, className = '', size = 'normal' }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const sizeClasses = {
    normal: 'col-span-1 row-span-1',
    wide: 'col-span-2 row-span-1',
    tall: 'col-span-1 row-span-2',
    large: 'col-span-2 row-span-2'
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY: rotateY,
        rotateX: rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        {children}
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, description, color, stats, size = 'normal' }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TiltCard size={size} className="perspective-1000">
      <motion.div
        className="glass-card h-full min-h-[200px] relative overflow-hidden group cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background Gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br opacity-10`}
          style={{ background: `linear-gradient(135deg, ${color}20, ${color}05)` }}
          animate={{
            opacity: isHovered ? 0.2 : 0.1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Content */}
        <div className="relative z-10 p-6 h-full flex flex-col">
          {/* Icon */}
          <motion.div
            className="mb-4"
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
          </motion.div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 kinetic-text">
            {title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
            {description}
          </p>

          {/* Stats */}
          {stats && (
            <div className="flex items-center justify-between text-xs">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-bold text-white">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Hover Effect */}
          <motion.div
            className="absolute inset-0 border-2 rounded-2xl pointer-events-none"
            style={{ borderColor: color }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isHovered ? 0.3 : 0,
              scale: isHovered ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </TiltCard>
  );
}

function Gallery3DCard() {
  return (
    <TiltCard size="large" className="perspective-1000">
      <div className="glass-card h-full min-h-[400px] relative overflow-hidden">
        {/* 3D Scene */}
        <div className="absolute inset-0">
          <Scene3D color="#8b5cf6" />
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            Interactive 3D Galleries
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            Experience art in immersive virtual spaces with real-time lighting and physics
          </p>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4 text-electric-blue" />
              <span>2.5M views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-holographic-pink" />
              <span>45K likes</span>
            </div>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

function StatsCard() {
  const stats = [
    { label: 'Active Users', value: '125K', change: '+12%', color: '#00d4ff' },
    { label: 'Galleries Created', value: '8.2K', change: '+24%', color: '#8b5cf6' },
    { label: 'Artworks Uploaded', value: '45K', change: '+18%', color: '#ff006e' },
  ];

  return (
    <TiltCard size="wide" className="perspective-1000">
      <div className="glass-card h-full min-h-[200px] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Platform Analytics</h3>
          <BarChart3 className="w-6 h-6 text-electric-blue" />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div 
                className="text-2xl font-bold mb-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-neon-green flex items-center justify-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </TiltCard>
  );
}

export default function BentoGrid() {
  const features = [
    {
      icon: Palette,
      title: "AI-Powered Curation",
      description: "Smart algorithms automatically organize and recommend artworks based on style, color, and user preferences.",
      color: "#00d4ff",
      stats: [
        { value: "95%", label: "Accuracy" },
        { value: "2.3s", label: "Speed" }
      ]
    },
    {
      icon: Zap,
      title: "Real-time Collaboration",
      description: "Work together with artists worldwide in shared virtual spaces with live editing and feedback.",
      color: "#8b5cf6",
      stats: [
        { value: "50+", label: "Users" },
        { value: "0.1s", label: "Latency" }
      ]
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Share your galleries instantly with audiences worldwide through optimized WebGL streaming.",
      color: "#ff006e",
      stats: [
        { value: "180+", label: "Countries" },
        { value: "99.9%", label: "Uptime" }
      ]
    },
    {
      icon: Users,
      title: "Community Hub",
      description: "Connect with fellow artists, join exhibitions, and participate in virtual art events.",
      color: "#00ff88",
      stats: [
        { value: "25K", label: "Artists" },
        { value: "500+", label: "Events" }
      ]
    },
    {
      icon: Sparkles,
      title: "Advanced Effects",
      description: "Apply stunning visual effects, particle systems, and dynamic lighting to enhance your artworks.",
      color: "#fbbf24",
      size: "tall"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to create, share, and experience stunning 3D art galleries
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, staggerChildren: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[200px]"
        >
          {/* Large 3D Gallery Card */}
          <Gallery3DCard />

          {/* Stats Card */}
          <StatsCard />

          {/* Feature Cards */}
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

