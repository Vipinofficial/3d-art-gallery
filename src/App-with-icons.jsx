import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { 
  Gallery, 
  Plus, 
  Eye, 
  BarChart3, 
  Sparkles,
  Clock,
  Users
} from 'lucide-react';

import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');

  // Mock data for testing
  const mockStatistics = {
    totalGalleries: 5,
    activeGalleries: 3,
    totalVisits: 42,
    totalRevenue: 1250
  };

  const mockGalleries = [
    {
      id: 1,
      name: "Traditional Indian Art",
      description: "A collection of classical Indian paintings",
      artworks: [{ id: 1 }, { id: 2 }, { id: 3 }],
      visitCount: 15,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      name: "Modern Sculptures",
      description: "Contemporary sculptural works",
      artworks: [{ id: 4 }, { id: 5 }],
      visitCount: 8,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const difference = expiry - now;

    if (difference <= 0) return 'Expired';

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setCurrentView('home')}
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
                onClick={() => setCurrentView('home')}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Home
              </Button>
              <Button
                variant={currentView === 'create' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('create')}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create
              </Button>
              <Button
                variant={currentView === 'manage' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('manage')}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                My Galleries
              </Button>
              <Button
                variant={currentView === 'stats' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('stats')}
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
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl text-white">
              <h2 className="text-4xl font-bold mb-4">Welcome to 3D Art Gallery</h2>
              <p className="text-xl mb-8 opacity-90">
                Create immersive virtual exhibitions featuring traditional Indian art forms
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => setCurrentView('create')}
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your Gallery
                </Button>
                <Button 
                  onClick={() => setCurrentView('manage')}
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
                value={mockStatistics.totalGalleries}
                icon={Gallery}
                color="blue"
              />
              <StatCard
                title="Active Galleries"
                value={mockStatistics.activeGalleries}
                icon={Clock}
                color="green"
              />
              <StatCard
                title="Total Visits"
                value={mockStatistics.totalVisits}
                icon={Users}
                color="purple"
              />
              <StatCard
                title="Revenue"
                value={formatCurrency(mockStatistics.totalRevenue)}
                icon={BarChart3}
                color="yellow"
              />
            </div>

            {/* Recent Galleries */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Recent Galleries</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockGalleries.map((gallery) => (
                  <GalleryCard
                    key={gallery.id}
                    gallery={gallery}
                    onView={() => alert(`Viewing ${gallery.name} - 3D Gallery will be implemented here`)}
                    getTimeRemaining={getTimeRemaining}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create View */}
        {currentView === 'create' && (
          <div className="space-y-8">
            <div className="text-center py-12 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl text-white">
              <h2 className="text-3xl font-bold mb-4">Create New Gallery</h2>
              <p className="text-lg mb-8 opacity-90">
                Design your virtual 3D art exhibition with customizable templates
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gallery Templates</CardTitle>
                  <CardDescription>Choose from pre-designed 3D gallery layouts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-semibold">Modern Minimalist</h4>
                      <p className="text-sm text-gray-600">Clean white walls with spot lighting</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-semibold">Traditional Gallery</h4>
                      <p className="text-sm text-gray-600">Classic museum-style layout</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-semibold">Contemporary Space</h4>
                      <p className="text-sm text-gray-600">Industrial design with dramatic lighting</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Art Categories</CardTitle>
                  <CardDescription>Select artwork types for your exhibition</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="paintings" className="rounded" />
                      <label htmlFor="paintings">Traditional Paintings</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="sculptures" className="rounded" />
                      <label htmlFor="sculptures">Sculptures</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="photography" className="rounded" />
                      <label htmlFor="photography">Photography</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="digital" className="rounded" />
                      <label htmlFor="digital">Digital Art</label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => alert('Gallery creation will be implemented with 3D features')}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                Create Gallery
              </Button>
            </div>
          </div>
        )}

        {/* Manage View */}
        {currentView === 'manage' && (
          <div className="space-y-8">
            <div className="text-center py-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white">
              <h2 className="text-3xl font-bold mb-4">Manage Your Galleries</h2>
              <p className="text-lg mb-8 opacity-90">
                View, edit, and manage your virtual art exhibitions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockGalleries.map((gallery) => (
                <Card key={gallery.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{gallery.name}</CardTitle>
                        <CardDescription>{gallery.description}</CardDescription>
                      </div>
                      <Badge variant="default">
                        {getTimeRemaining(gallery.expiresAt)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Artworks:</span>
                        <span>{gallery.artworks?.length || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Visits:</span>
                        <span>{gallery.visitCount || 0}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => alert(`Viewing ${gallery.name} in 3D`)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => alert(`Editing ${gallery.name}`)}
                          className="flex-1"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Statistics View */}
        {currentView === 'stats' && (
          <div className="space-y-8">
            <div className="text-center py-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl text-white">
              <h2 className="text-3xl font-bold mb-4">Gallery Statistics</h2>
              <p className="text-lg mb-8 opacity-90">
                Track your gallery performance and visitor engagement
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Galleries"
                value={mockStatistics.totalGalleries}
                icon={Gallery}
                color="blue"
              />
              <StatCard
                title="Active Galleries"
                value={mockStatistics.activeGalleries}
                icon={Clock}
                color="green"
              />
              <StatCard
                title="Total Visits"
                value={mockStatistics.totalVisits}
                icon={Users}
                color="purple"
              />
              <StatCard
                title="Revenue"
                value={formatCurrency(mockStatistics.totalRevenue)}
                icon={BarChart3}
                color="yellow"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>Key metrics for your art galleries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Average visits per gallery</span>
                    <span className="font-semibold">{Math.round(mockStatistics.totalVisits / mockStatistics.totalGalleries)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Most popular gallery</span>
                    <span className="font-semibold">Traditional Indian Art</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Average revenue per gallery</span>
                    <span className="font-semibold">{formatCurrency(mockStatistics.totalRevenue / mockStatistics.totalGalleries)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
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

function GalleryCard({ gallery, onView, getTimeRemaining }) {
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

