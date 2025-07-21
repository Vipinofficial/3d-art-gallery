import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gallery, 
  Plus, 
  Eye, 
  Settings, 
  BarChart3, 
  Palette,
  Sparkles,
  Clock,
  Users
} from 'lucide-react';

// Import our components
import GalleryCreator from './components/gallery/GalleryCreator';
import GalleryManager from './components/gallery/GalleryManager';
import GalleryViewer from './components/gallery/GalleryViewer';
import PurchaseForm from './components/purchase/PurchaseForm';

// Import data manager
import dataManager from './lib/dataManager';
import { formatCurrency, getTimeRemaining } from './lib/utils';

import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  
  // Data states
  const [galleries, setGalleries] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [artPieces, setArtPieces] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);

  // Initialize data on component mount
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      
      // Wait for data manager to initialize
      await dataManager.initializeData();
      
      // Load all data
      loadAllData();
      
      // Cleanup expired galleries
      dataManager.cleanupExpiredGalleries();
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = () => {
    setGalleries(dataManager.getAllGalleries());
    setTemplates(dataManager.getAllTemplates());
    setArtPieces(dataManager.getAllArtPieces());
    setPurchases(dataManager.getAllPurchases());
    setStatistics(dataManager.getStatistics());
  };

  // Gallery Management Functions
  const handleCreateGallery = (galleryData) => {
    const success = dataManager.saveGallery(galleryData);
    if (success) {
      loadAllData();
      setCurrentView('manage');
      console.log('Gallery created successfully:', galleryData.name);
    }
  };

  const handleViewGallery = (gallery) => {
    // Record visit
    dataManager.recordGalleryVisit(gallery.id);
    
    // Get template and artworks for the gallery
    const template = dataManager.getTemplateById(gallery.templateId);
    const galleryArtworks = gallery.artworks.map(artworkRef => {
      const artPiece = dataManager.getArtPieceById(artworkRef.artId);
      return {
        ...artPiece,
        ...artworkRef, // Include position, wall, sold status
        position: artworkRef.position,
        wall: artworkRef.wall,
        sold: artworkRef.sold
      };
    });

    setSelectedGallery({
      ...gallery,
      template,
      artworks: galleryArtworks
    });
    setCurrentView('view');
  };

  const handleEditGallery = (gallery) => {
    // For now, redirect to create with pre-filled data
    // In a full implementation, this would open an edit mode
    console.log('Edit gallery:', gallery.name);
  };

  const handleDeleteGallery = (galleryId) => {
    const success = dataManager.deleteGallery(galleryId);
    if (success) {
      loadAllData();
      console.log('Gallery deleted successfully');
    }
  };

  // Purchase Functions
  const handlePurchaseArt = (artwork, gallery) => {
    setSelectedArtwork(artwork);
    setSelectedGallery(gallery);
    setShowPurchaseForm(true);
  };

  const handlePurchaseComplete = (purchaseData) => {
    const success = dataManager.savePurchase(purchaseData);
    if (success) {
      loadAllData();
      setShowPurchaseForm(false);
      setSelectedArtwork(null);
      console.log('Purchase completed successfully');
    }
  };

  // Navigation Functions
  const navigateToHome = () => {
    setCurrentView('home');
    setSelectedGallery(null);
  };

  const navigateToCreate = () => {
    setCurrentView('create');
  };

  const navigateToManage = () => {
    setCurrentView('manage');
  };

  const navigateToStats = () => {
    setCurrentView('stats');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Loading 3D Art Gallery...</h2>
          <p className="text-gray-300">Initializing WebGL and Three.js</p>
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
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={navigateToHome}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Gallery className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">3D Art Gallery</h1>
                <p className="text-sm text-gray-600">Virtual Exhibition Experience</p>
              </div>
            </div>

            <nav className="flex items-center gap-2">
              <Button
                variant={currentView === 'home' ? 'default' : 'ghost'}
                onClick={navigateToHome}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Home
              </Button>
              <Button
                variant={currentView === 'create' ? 'default' : 'ghost'}
                onClick={navigateToCreate}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create
              </Button>
              <Button
                variant={currentView === 'manage' ? 'default' : 'ghost'}
                onClick={navigateToManage}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                My Galleries
              </Button>
              <Button
                variant={currentView === 'stats' ? 'default' : 'ghost'}
                onClick={navigateToStats}
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Statistics
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Home View */}
        {currentView === 'home' && (
          <HomeView
            statistics={statistics}
            recentGalleries={galleries.slice(0, 6)}
            onCreateNew={navigateToCreate}
            onViewGallery={handleViewGallery}
            onManageGalleries={navigateToManage}
          />
        )}

        {/* Create Gallery View */}
        {currentView === 'create' && (
          <GalleryCreator
            templates={templates}
            artPieces={artPieces}
            onCreateGallery={handleCreateGallery}
          />
        )}

        {/* Manage Galleries View */}
        {currentView === 'manage' && (
          <GalleryManager
            galleries={galleries}
            onViewGallery={handleViewGallery}
            onEditGallery={handleEditGallery}
            onDeleteGallery={handleDeleteGallery}
            onCreateNew={navigateToCreate}
          />
        )}

        {/* Gallery Viewer */}
        {currentView === 'view' && selectedGallery && (
          <GalleryViewer
            gallery={selectedGallery}
            template={selectedGallery.template}
            artworks={selectedGallery.artworks}
            onPurchaseArt={handlePurchaseArt}
          />
        )}

        {/* Statistics View */}
        {currentView === 'stats' && (
          <StatisticsView statistics={statistics} purchases={purchases} />
        )}
      </main>

      {/* Purchase Form Modal */}
      {showPurchaseForm && selectedArtwork && selectedGallery && (
        <PurchaseForm
          artwork={selectedArtwork}
          gallery={selectedGallery}
          open={showPurchaseForm}
          onClose={() => {
            setShowPurchaseForm(false);
            setSelectedArtwork(null);
          }}
          onPurchaseComplete={handlePurchaseComplete}
        />
      )}
    </div>
  );
}

// Home View Component
function HomeView({ statistics, recentGalleries, onCreateNew, onViewGallery, onManageGalleries }) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl text-white">
        <h2 className="text-4xl font-bold mb-4">Welcome to 3D Art Gallery</h2>
        <p className="text-xl mb-8 opacity-90">
          Create immersive virtual exhibitions featuring traditional Indian art forms
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            onClick={onCreateNew}
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your Gallery
          </Button>
          <Button 
            onClick={onManageGalleries}
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-purple-600"
          >
            <Eye className="w-5 h-5 mr-2" />
            View Galleries
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Galleries"
          value={statistics.totalGalleries || 0}
          icon={Gallery}
          color="blue"
        />
        <StatCard
          title="Active Galleries"
          value={statistics.activeGalleries || 0}
          icon={Clock}
          color="green"
        />
        <StatCard
          title="Total Visits"
          value={statistics.totalVisits || 0}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(statistics.totalRevenue || 0)}
          icon={BarChart3}
          color="yellow"
        />
      </div>

      {/* Recent Galleries */}
      {recentGalleries.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-6">Recent Galleries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentGalleries.map((gallery) => (
              <GalleryCard
                key={gallery.id}
                gallery={gallery}
                onView={() => onViewGallery(gallery)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Statistics View Component
function StatisticsView({ statistics, purchases }) {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Gallery Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Galleries"
          value={statistics.totalGalleries || 0}
          icon={Gallery}
          color="blue"
        />
        <StatCard
          title="Total Purchases"
          value={statistics.totalPurchases || 0}
          icon={BarChart3}
          color="green"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(statistics.totalRevenue || 0)}
          icon={BarChart3}
          color="yellow"
        />
        <StatCard
          title="Avg Visits/Gallery"
          value={Math.round(statistics.averageVisitsPerGallery || 0)}
          icon={Users}
          color="purple"
        />
      </div>

      {/* Recent Purchases */}
      {purchases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {purchases.slice(0, 10).map((purchase) => (
                <div key={purchase.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{purchase.buyerInfo.firstName} {purchase.buyerInfo.lastName}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {formatCurrency(purchase.paymentInfo.amount)}
                    </p>
                    <Badge variant={purchase.paymentInfo.status === 'completed' ? 'default' : 'secondary'}>
                      {purchase.paymentInfo.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Reusable Components
function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GalleryCard({ gallery, onView }) {
  const timeRemaining = getTimeRemaining(gallery.expiresAt);
  const isExpired = timeRemaining === 'Expired';

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${isExpired ? 'opacity-75' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{gallery.name}</CardTitle>
            <CardDescription>{gallery.description}</CardDescription>
          </div>
          <Badge variant={isExpired ? 'destructive' : 'default'}>
            {timeRemaining}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <p>{gallery.artworks?.length || 0} artworks</p>
            <p>{gallery.visitCount || 0} visits</p>
          </div>
          <Button onClick={onView} size="sm">
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default App;
