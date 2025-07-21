import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import GalleryCreator3D from './components/gallery/GalleryCreator3D';
import GalleryManager from './components/gallery/GalleryManager';
import GalleryViewer from './components/gallery/GalleryViewer';
import dataManager from './lib/dataManager';

import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [galleries, setGalleries] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [sharedGalleryId, setSharedGalleryId] = useState(null);

  // Check for shared gallery in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const galleryId = urlParams.get('gallery');
    
    if (galleryId) {
      setSharedGalleryId(galleryId);
      setCurrentView('viewer');
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize data manager
        await dataManager.initializeData();
        
        // Load galleries and statistics
        const userGalleries = dataManager.getAllGalleries();
        const stats = dataManager.getStatistics();
        
        setGalleries(userGalleries);
        setStatistics(stats);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Refresh data when returning to home view
  useEffect(() => {
    if (currentView === 'home') {
      const userGalleries = dataManager.getAllGalleries();
      const stats = dataManager.getStatistics();
      setGalleries(userGalleries);
      setStatistics(stats);
    }
  }, [currentView]);

  const handleGalleryCreated = () => {
    // Refresh galleries after creation
    const userGalleries = dataManager.getAllGalleries();
    const stats = dataManager.getStatistics();
    setGalleries(userGalleries);
    setStatistics(stats);
    setCurrentView('home');
  };

  const handleViewGallery = (galleryId) => {
    // Record visit and open gallery
    dataManager.recordGalleryVisit(galleryId);
    
    // Set shared gallery ID and switch to viewer
    setSharedGalleryId(galleryId);
    setCurrentView('viewer');
    
    // Update URL without page reload
    const newUrl = `${window.location.origin}${window.location.pathname}?gallery=${galleryId}`;
    window.history.pushState({ galleryId }, '', newUrl);
    
    // Refresh statistics
    const stats = dataManager.getStatistics();
    setStatistics(stats);
  };

  const handleCloseViewer = () => {
    setSharedGalleryId(null);
    setCurrentView('home');
    
    // Clear URL parameters
    window.history.pushState({}, '', window.location.origin + window.location.pathname);
  };

  const generateShareableLink = (galleryId) => {
    return `${window.location.origin}${window.location.pathname}?gallery=${galleryId}`;
  };

  const handleShareGallery = (galleryId) => {
    const shareableLink = generateShareableLink(galleryId);
    
    if (navigator.share) {
      // Use native sharing if available
      navigator.share({
        title: 'Check out this 3D Art Gallery',
        text: 'View this amazing virtual art exhibition',
        url: shareableLink
      }).catch(console.error);
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareableLink).then(() => {
        alert('Shareable link copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        prompt('Copy this link to share:', shareableLink);
      });
    }
  };

  const formatTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 3D Art Gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">3D</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">3D Art Gallery</h1>
                <p className="text-sm text-gray-600">Virtual Exhibition Experience</p>
              </div>
            </div>

            <nav className="flex items-center gap-2">
              <Button
                variant={currentView === 'home' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('home')}
              >
                Home
              </Button>
              <Button
                variant={currentView === 'create' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('create')}
              >
                Create
              </Button>
              <Button
                variant={currentView === 'manage' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('manage')}
              >
                Galleries
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Home View */}
        {currentView === 'home' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl text-white">
              <h2 className="text-4xl font-bold mb-4">Welcome to 3D Art Gallery</h2>
              <p className="text-xl mb-8 opacity-90">
                Create immersive virtual exhibitions featuring your own artwork
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => setCurrentView('create')}
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  Create Your Gallery
                </Button>
                <Button 
                  onClick={() => setCurrentView('manage')}
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-600"
                >
                  Manage Galleries
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Galleries</p>
                      <p className="text-2xl font-bold">{statistics.totalGalleries || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">G</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Galleries</p>
                      <p className="text-2xl font-bold">{statistics.activeGalleries || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">A</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Visits</p>
                      <p className="text-2xl font-bold">{statistics.totalVisits || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">V</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold">
                        {dataManager.formatCurrency(statistics.totalRevenue || 0)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">$</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Galleries */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Your Galleries</h3>
                {galleries.length > 0 && (
                  <Button 
                    onClick={() => setCurrentView('manage')}
                    variant="outline"
                  >
                    Manage All
                  </Button>
                )}
              </div>
              
              {galleries.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-gray-500 text-2xl">🎨</span>
                    </div>
                    <h4 className="text-lg font-semibold mb-2">No galleries yet</h4>
                    <p className="text-gray-600 mb-4">
                      Create your first 3D gallery to showcase your artwork
                    </p>
                    <Button onClick={() => setCurrentView('create')}>
                      Create Your First Gallery
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleries.slice(0, 6).map((gallery) => (
                    <Card 
                      key={gallery.id} 
                      className={`overflow-hidden transition-all hover:shadow-lg ${
                        gallery.isExpired ? 'opacity-60' : ''
                      }`}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{gallery.name}</CardTitle>
                            <CardDescription>
                              {gallery.template?.name || 'Custom Template'}
                            </CardDescription>
                          </div>
                          <Badge variant={gallery.isExpired ? 'destructive' : 'default'}>
                            {formatTimeRemaining(gallery.expiresAt)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            <p>{gallery.artworks?.length || 0} artworks</p>
                            <p>{gallery.visitCount || 0} visits</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              onClick={() => handleViewGallery(gallery.id)}
                              disabled={gallery.isExpired}
                            >
                              View
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleShareGallery(gallery.id)}
                            >
                              Share
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create View */}
        {currentView === 'create' && (
          <GalleryCreator3D onGalleryCreated={handleGalleryCreated} />
        )}

        {/* Gallery Viewer */}
        {currentView === 'viewer' && sharedGalleryId && (
          <GalleryViewer 
            galleryId={sharedGalleryId}
            onClose={handleCloseViewer}
          />
        )}

        {/* Manage View */}
        {currentView === 'manage' && (
          <GalleryManager 
            galleries={galleries}
            onGalleryUpdate={() => {
              const userGalleries = dataManager.getAllGalleries();
              const stats = dataManager.getStatistics();
              setGalleries(userGalleries);
              setStatistics(stats);
            }}
            onViewGallery={handleViewGallery}
            onShareGallery={handleShareGallery}
          />
        )}
      </main>
    </div>
  );
}

export default App;

