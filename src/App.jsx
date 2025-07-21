import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Play, Palette, Zap, Globe, Users, BarChart3, Eye, Heart, TrendingUp } from 'lucide-react';
import { Button } from './components/ui/button';
import './App.css';

// Loading Screen Component
function LoadingScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-deep-space"
    >
      <div className="text-center">
        {/* Loading Animation */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="w-20 h-20 border-4 border-electric-blue/30 border-t-electric-blue rounded-full mx-auto mb-8"
        />
        
        {/* Loading Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl font-bold gradient-text mb-4"
        >
          Ultimate 3D Gallery
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-muted-foreground"
        >
          Loading immersive experience...
        </motion.p>
        
        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.5, duration: 2.5, ease: 'easeInOut' }}
          className="h-1 bg-gradient-to-r from-electric-blue to-cyber-purple rounded-full mt-8 mx-auto max-w-xs"
        />
      </div>
    </motion.div>
  );
}

// Navigation Component
function Navigation({ activeSection, setActiveSection }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'create', label: 'Create' },
    { id: 'features', label: 'Features' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="nav-glass flex items-center justify-between px-8 py-4"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="flex items-center space-x-3"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-electric-blue to-cyber-purple rounded-xl flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold gradient-text">Ultimate 3D Gallery</h1>
          <p className="text-xs text-muted-foreground">Immersive Experience</p>
        </div>
      </motion.div>

      {/* Navigation Items */}
      <div className="hidden md:flex items-center space-x-2">
        {navItems.map((item, index) => {
          const isActive = activeSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              onClick={() => setActiveSection(item.id)}
              className={`nav-item flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-electric-blue/20 text-electric-blue shadow-glow' 
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
      >
        <Button className="magnetic-button bg-gradient-to-r from-electric-blue to-cyber-purple hover:shadow-glow">
          Get Started
        </Button>
      </motion.div>
    </motion.nav>
  );
}

// Hero Section Component
function HeroSection({ setActiveSection }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background Elements */}
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

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-hero font-black leading-tight mb-4">
            <span className="gradient-text">Ultimate</span>
          </h1>
          <h1 className="text-hero font-black leading-tight mb-4">
            <span className="glow-text">3D Art Gallery</span>
          </h1>
          <p className="text-2xl md:text-4xl font-light text-muted-foreground">
            Experience the Future of Digital Art
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
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
          transition={{ delay: 1, duration: 0.8 }}
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
          transition={{ delay: 1.5, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            { icon: Sparkles, value: "10K+", label: "Artworks" },
            { icon: Zap, value: "500+", label: "Artists" },
            { icon: Play, value: "1M+", label: "Views" },
            { icon: ArrowRight, value: "99%", label: "Satisfaction" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.6 + index * 0.1, type: 'spring', stiffness: 200 }}
              className="glass-card text-center p-6 hover:shadow-purple-glow transition-all duration-300"
            >
              <stat.icon className="w-8 h-8 text-electric-blue mx-auto mb-3" />
              <div className="text-2xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      icon: Palette,
      title: "AI-Powered Curation",
      description: "Smart algorithms automatically organize and recommend artworks based on style, color, and user preferences.",
      color: "#00d4ff",
    },
    {
      icon: Zap,
      title: "Real-time Collaboration",
      description: "Work together with artists worldwide in shared virtual spaces with live editing and feedback.",
      color: "#8b5cf6",
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Share your galleries instantly with audiences worldwide through optimized WebGL streaming.",
      color: "#ff006e",
    },
    {
      icon: Users,
      title: "Community Hub",
      description: "Connect with fellow artists, join exhibitions, and participate in virtual art events.",
      color: "#00ff88",
    },
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

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="glass-card h-full min-h-[300px] relative overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              {/* Background Gradient */}
              <div 
                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                style={{ background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}05)` }}
              />

              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-direction-column">
                {/* Icon */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-4 kinetic-text">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Other Section Components
function ExploreSection() {
  return (
    <section className="min-h-screen flex items-center justify-center py-20">
      <div className="max-w-4xl mx-auto text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-5xl font-bold gradient-text mb-8"
        >
          Explore Galleries
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-xl text-muted-foreground mb-12"
        >
          Discover amazing 3D art galleries created by artists worldwide
        </motion.p>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: item * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="glass-card h-64 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-electric-blue to-cyber-purple rounded-xl mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-white mb-2">Gallery {item}</h3>
                <p className="text-sm text-muted-foreground">Artist Name</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CreateSection() {
  return (
    <section className="min-h-screen flex items-center justify-center py-20">
      <div className="max-w-4xl mx-auto text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-5xl font-bold gradient-text mb-8"
        >
          Create Your Gallery
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-xl text-muted-foreground mb-12"
        >
          Build stunning 3D galleries with our intuitive creation tools
        </motion.p>
        
        {/* Creation Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: 1, title: "Upload Artwork", desc: "Add your digital art pieces" },
            { step: 2, title: "Choose Template", desc: "Select from stunning 3D environments" },
            { step: 3, title: "Customize & Share", desc: "Personalize and publish your gallery" }
          ].map((item) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: item.step * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-electric-blue to-cyber-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">{item.step}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main App Component
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <>
            <HeroSection setActiveSection={setActiveSection} />
            <FeaturesSection />
          </>
        );
      case 'explore':
        return <ExploreSection />;
      case 'create':
        return <CreateSection />;
      case 'features':
        return <FeaturesSection />;
      default:
        return (
          <>
            <HeroSection setActiveSection={setActiveSection} />
            <FeaturesSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-deep-space text-white overflow-x-hidden">
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            key="main-content"
          >
            {/* Navigation */}
            <Navigation 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} 
            />

            {/* Main Content */}
            <main className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {renderSection()}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-12 border-t border-white/10">
              <div className="max-w-7xl mx-auto px-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-bold gradient-text mb-4">
                    Ultimate 3D Gallery
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Transforming digital art into immersive experiences
                  </p>
                  <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-electric-blue transition-colors">Privacy</a>
                    <a href="#" className="hover:text-electric-blue transition-colors">Terms</a>
                    <a href="#" className="hover:text-electric-blue transition-colors">Support</a>
                    <a href="#" className="hover:text-electric-blue transition-colors">Contact</a>
                  </div>
                </motion.div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

