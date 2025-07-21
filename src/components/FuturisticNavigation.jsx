import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Image, Plus, Sparkles, User, Search } from 'lucide-react';
import { Button } from './ui/button';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Search },
  { id: 'galleries', label: 'Galleries', icon: Image },
  { id: 'create', label: 'Create', icon: Plus },
  { id: 'features', label: 'Features', icon: Sparkles },
  { id: 'profile', label: 'Profile', icon: User },
];

function MagneticButton({ children, onClick, className = '', ...props }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 to-cyber-purple/20 rounded-lg"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isHovered ? 1 : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="relative z-10"
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.button>
  );
}

function DesktopNavigation({ activeSection, setActiveSection }) {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="nav-glass hidden lg:flex items-center justify-between px-8 py-4"
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
      <div className="flex items-center space-x-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <motion.div
              key={item.id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
            >
              <MagneticButton
                onClick={() => setActiveSection(item.id)}
                className={`nav-item flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-electric-blue/20 text-electric-blue shadow-glow' 
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </MagneticButton>
            </motion.div>
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

function MobileNavigation({ activeSection, setActiveSection }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Header */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="nav-glass lg:hidden flex items-center justify-between px-4 py-3"
      >
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-cyber-purple rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold gradient-text">3D Gallery</h1>
        </div>

        {/* Menu Toggle */}
        <MagneticButton
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white hover:text-electric-blue transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </MagneticButton>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] glass-effect z-50 p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-cyber-purple rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold gradient-text">3D Gallery</h2>
                </div>
                <MagneticButton
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white hover:text-electric-blue transition-colors"
                >
                  <X className="w-6 h-6" />
                </MagneticButton>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                    >
                      <MagneticButton
                        onClick={() => {
                          setActiveSection(item.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                          isActive 
                            ? 'bg-electric-blue/20 text-electric-blue shadow-glow' 
                            : 'text-muted-foreground hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </MagneticButton>
                    </motion.div>
                  );
                })}
                
                {/* Get Started Button */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="pt-6 border-t border-white/10"
                >
                  <Button 
                    className="w-full magnetic-button bg-gradient-to-r from-electric-blue to-cyber-purple hover:shadow-glow"
                    onClick={() => {
                      setActiveSection('create');
                      setIsOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function FuturisticNavigation({ activeSection, setActiveSection }) {
  return (
    <>
      <DesktopNavigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <MobileNavigation activeSection={activeSection} setActiveSection={setActiveSection} />
    </>
  );
}

