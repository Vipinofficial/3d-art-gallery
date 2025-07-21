import React, { useState, useEffect, useRef } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Play, Palette, Zap, Globe, ArrowRight, Star, Users, Award, Eye } from 'lucide-react';

// Import custom components
import ThreeBackground from './components/ThreeBackground';
import InteractiveGallery from './components/InteractiveGallery';
import ParticleSystem from './components/ParticleSystem';
import GalleryCreator from './components/GalleryCreator';
import GalleryViewer from './components/GalleryViewer';
import MobileNavigation from './components/MobileNavigation';
import {
  AnimatedCounter,
  MagneticButton,
  FloatingCard,
  TextReveal,
  MorphingShape,
  ParallaxContainer,
  GlitchText,
  ScrollSection,
  InteractiveTimeline
} from './components/AnimatedSection';

// Import GSAP hooks
import {
  useScrollAnimations,
  useLoadingAnimation,
  useHoverAnimations,
  useScrollProgress,
  useMagneticEffect
} from './hooks/useGSAP';

import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [galleries, setGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const heroRef = useRef();

  // Initialize animations
  useScrollAnimations();
  useLoadingAnimation(isLoading);
  useHoverAnimations();
  useScrollProgress();
  useMagneticEffect(heroRef, 0.1);

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Load existing galleries from localStorage
    const savedGalleries = JSON.parse(localStorage.getItem('galleries') || '[]');
    setGalleries(savedGalleries);

    return () => clearTimeout(timer);
  }, []);

  // Gallery management functions
  const handleGalleryCreated = (newGallery) => {
    setGalleries(prev => [...prev, newGallery]);
    setCurrentView('home');
    // Show success message or redirect
    alert('Gallery created successfully!');
  };

  const handleViewGallery = (gallery) => {
    setSelectedGallery(gallery);
    setCurrentView('viewer');
  };

  const handleCreateGallery = () => {
    setCurrentView('create');
  };

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Immersive 3D Galleries",
      description: "Create stunning virtual art spaces with WebGL technology"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Interactions",
      description: "Engage visitors with dynamic animations and effects"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Accessibility",
      description: "Share your art with audiences worldwide instantly"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Track visitor engagement and gallery performance"
    }
  ];

  const timelineItems = [
    {
      title: "Upload Your Artwork",
      description: "Simply drag and drop your digital art pieces"
    },
    {
      title: "Choose Gallery Template",
      description: "Select from our collection of stunning 3D environments"
    },
    {
      title: "Customize Experience",
      description: "Add interactive elements and animations"
    },
    {
      title: "Share & Showcase",
      description: "Publish your gallery and share with the world"
    }
  ];

  const stats = [
    { label: "Active Galleries", value: galleries.length, suffix: "" },
    { label: "Artists Worldwide", value: 850, suffix: "+" },
    { label: "Monthly Visitors", value: 45, suffix: "K+" },
    { label: "Artworks Displayed", value: galleries.reduce((total, gallery) => total + (gallery.artworks?.length || 0), 0), suffix: "" }
  ];

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="text-center">
          <div className="loading-spinner mb-6"></div>
          <TextReveal className="text-2xl font-bold text-white mb-2">
            3D Art Gallery
          </TextReveal>
          <p className="text-gray-400">Loading immersive experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Scroll Progress Indicator */}
      <div className="scroll-indicator fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 z-50 scale-x-0"></div>

      {/* Background Effects */}
      <ThreeBackground />
      <ParticleSystem />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass-effect border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 nav-item">
              <MorphingShape className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold gradient-text">3D Art Gallery</h1>
                <p className="text-xs text-gray-400">Interactive Experience</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              {['Home', 'Gallery', 'Create', 'Features', 'About'].map((item, index) => (
                <button
                  key={item}
                  className="nav-item text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
                  onClick={() => setCurrentView(item.toLowerCase())}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
              
              <MagneticButton className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-medium hover-btn">
                Get Started
              </MagneticButton>
            </div>

            {/* Mobile Navigation */}
            <MobileNavigation currentView={currentView} setCurrentView={setCurrentView} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <section ref={heroRef} className="min-h-screen flex items-center justify-center relative">
              <div className="max-w-7xl mx-auto px-6 text-center hero-content">
                <div className="mb-8">
                  <TextReveal className="text-6xl md:text-8xl font-black mb-6">
                    <GlitchText>Create</GlitchText> Stunning
                  </TextReveal>
                  <TextReveal className="text-6xl md:text-8xl font-black gradient-text mb-8">
                    3D Art Galleries
                  </TextReveal>
                </div>

                <ScrollSection animation="fadeIn" className="mb-12">
                  <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Transform your digital artwork into immersive virtual exhibitions 
                    with cutting-edge WebGL technology and interactive animations.
                  </p>
                </ScrollSection>

                <ScrollSection animation="scaleUp" className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <MagneticButton 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover-btn flex items-center gap-3"
                    strength={0.5}
                    onClick={handleCreateGallery}
                  >
                    <Play className="w-5 h-5" />
                    Start Creating
                  </MagneticButton>
                  
                  <MagneticButton 
                    className="border border-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold hover-btn glass-effect"
                    onClick={() => setCurrentView('gallery')}
                  >
                    Explore Galleries
                  </MagneticButton>
                </ScrollSection>

                {/* Floating Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 stagger-container">
                  {stats.map((stat, index) => (
                    <FloatingCard key={index} className="stagger-item text-center p-6 glass-effect rounded-2xl" delay={index * 0.2}>
                      <div className="text-3xl font-bold gradient-text mb-2">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                      </div>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                    </FloatingCard>
                  ))}
                </div>
              </div>

              {/* Scroll Indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <ScrollSection className="py-32 relative">
              <ParallaxContainer speed={0.3} className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20"></div>
              </ParallaxContainer>
              
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                  <TextReveal className="text-5xl font-bold mb-6">
                    Powerful Features
                  </TextReveal>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Everything you need to create professional virtual art exhibitions
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-container">
                  {features.map((feature, index) => (
                    <FloatingCard 
                      key={index} 
                      className="stagger-item p-8 glass-effect rounded-2xl text-center group"
                      delay={index * 0.1}
                    >
                      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                    </FloatingCard>
                  ))}
                </div>
              </div>
            </ScrollSection>

            {/* How It Works Section */}
            <ScrollSection className="py-32 bg-gradient-to-br from-purple-900/10 to-pink-900/10">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                  <TextReveal className="text-5xl font-bold mb-6">
                    How It Works
                  </TextReveal>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Create your virtual gallery in just four simple steps
                  </p>
                </div>

                <div className="max-w-4xl mx-auto">
                  <InteractiveTimeline items={timelineItems} />
                </div>
              </div>
            </ScrollSection>

            {/* CTA Section */}
            <ScrollSection className="py-32 text-center">
              <div className="max-w-4xl mx-auto px-6">
                <TextReveal className="text-5xl font-bold mb-8">
                  Ready to Showcase Your Art?
                </TextReveal>
                <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                  Join thousands of artists who are already creating stunning virtual galleries
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <MagneticButton 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover-btn flex items-center gap-3 mx-auto sm:mx-0"
                    strength={0.5}
                    onClick={handleCreateGallery}
                  >
                    Create Your Gallery
                    <ArrowRight className="w-5 h-5" />
                  </MagneticButton>
                </div>
              </div>
            </ScrollSection>
          </>
        )}

        {currentView === 'gallery' && (
          <section className="min-h-screen">
            {selectedGallery ? (
              <GalleryViewer 
                gallery={selectedGallery}
                onClose={() => {
                  setSelectedGallery(null);
                  setCurrentView('gallery');
                }}
              />
            ) : galleries.length > 0 ? (
              <div className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">Gallery Collection</h2>
                    <p className="text-xl text-gray-300">Explore amazing virtual art galleries</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {galleries.map((gallery) => (
                      <FloatingCard key={gallery.id} className="p-6 glass-effect rounded-xl cursor-pointer" onClick={() => handleViewGallery(gallery)}>
                        <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                          <span className="text-white font-semibold">Gallery Preview</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">{gallery.name}</h3>
                        <p className="text-gray-400 text-sm mb-3">{gallery.description}</p>
                        <div className="flex justify-between items-center">
                          <Badge>{gallery.artworks?.length || 0} artworks</Badge>
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleViewGallery(gallery); }}>
                            View Gallery
                          </Button>
                        </div>
                      </FloatingCard>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <InteractiveGallery 
                onArtworkClick={(artwork) => console.log('Clicked artwork:', artwork)}
              />
            )}
          </section>
        )}

        {currentView === 'create' && (
          <section className="min-h-screen py-20">
            <GalleryCreator onGalleryCreated={handleGalleryCreated} />
          </section>
        )}

        {currentView === 'features' && (
          <ScrollSection className="py-32">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <TextReveal className="text-5xl font-bold mb-6">
                  Advanced Features
                </TextReveal>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Discover all the powerful tools at your disposal
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  {features.map((feature, index) => (
                    <FloatingCard key={index} className="p-6 glass-effect rounded-xl" delay={index * 0.1}>
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                          <p className="text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                    </FloatingCard>
                  ))}
                </div>

                <div className="relative">
                  <FloatingCard className="aspect-square glass-effect rounded-2xl p-8 flex items-center justify-center">
                    <div className="text-center">
                      <MorphingShape className="w-32 h-32 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-white mb-4">Interactive Demo</h3>
                      <p className="text-gray-400">Experience the power of 3D galleries</p>
                    </div>
                  </FloatingCard>
                </div>
              </div>
            </div>
          </ScrollSection>
        )}
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-white/10 glass-effect">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <MorphingShape className="w-8 h-8" />
            <span className="text-xl font-bold gradient-text">3D Art Gallery</span>
          </div>
          <p className="text-gray-400 mb-8">
            Transforming digital art into immersive experiences
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

