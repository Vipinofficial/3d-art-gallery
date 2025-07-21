import React, { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

export default function MobileNavigation({ currentView, setCurrentView }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'create', label: 'Create' },
    { id: 'features', label: 'Features' },
    { id: 'about', label: 'About' }
  ];

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#1e1e3f]/95 backdrop-blur-xl border-l border-white/20 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <img src="/logo-horizontal.png" alt="3D Art Gallery" className="h-6" />
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    currentView === item.id
                      ? 'bg-[#6366f1] text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Get Started Button */}
              <div className="pt-6 border-t border-white/20">
                <button
                  onClick={() => handleNavClick('create')}
                  className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-medium py-3 px-4 rounded-lg hover:shadow-lg transition-all"
                >
                  Get Started
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

