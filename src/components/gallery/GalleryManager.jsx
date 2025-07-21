import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import dataManager from '../../lib/dataManager';

export default function GalleryManager({ galleries, onGalleryUpdate, onViewGallery, onShareGallery }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const handleDeleteGallery = (galleryId) => {
    if (dataManager.deleteGallery(galleryId)) {
      onGalleryUpdate();
    }
  };

  const handleCleanupExpired = () => {
    const cleanedCount = dataManager.cleanupExpiredGalleries();
    if (cleanedCount > 0) {
      onGalleryUpdate();
      alert(`Cleaned up ${cleanedCount} expired galleries`);
    } else {
      alert('No expired galleries to clean up');
    }
  };

  const handleExportData = () => {
    const data = dataManager.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gallery-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (dataManager.importData(data)) {
            onGalleryUpdate();
            alert('Data imported successfully!');
          } else {
            alert('Failed to import data. Please check the file format.');
          }
        } catch (error) {
          alert('Invalid JSON file. Please select a valid export file.');
        }
      };
      reader.readAsText(file);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter and sort galleries
  const filteredGalleries = galleries
    .filter(gallery => {
      const matchesSearch = gallery.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || 
        (filterStatus === 'active' && !gallery.isExpired) ||
        (filterStatus === 'expired' && gallery.isExpired);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'visits':
          return (b.visitCount || 0) - (a.visitCount || 0);
        case 'expiry':
          return new Date(a.expiresAt) - new Date(b.expiresAt);
        default:
          return 0;
      }
    });

  const activeGalleries = galleries.filter(g => !g.isExpired);
  const expiredGalleries = galleries.filter(g => g.isExpired);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl text-white">
        <h2 className="text-3xl font-bold mb-4">Gallery Management</h2>
        <p className="text-lg opacity-90">
          Manage your virtual exhibitions and track performance
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Galleries</p>
                <p className="text-2xl font-bold">{galleries.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeGalleries.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">✅</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-red-600">{expiredGalleries.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">⏰</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Visits</p>
                <p className="text-2xl font-bold">
                  {galleries.reduce((sum, g) => sum + (g.visitCount || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">👁️</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <Input
            placeholder="Search galleries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Galleries</option>
            <option value="active">Active Only</option>
            <option value="expired">Expired Only</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
            <option value="visits">Most Visited</option>
            <option value="expiry">Expiring Soon</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleExportData} variant="outline">
            Export Data
          </Button>
          
          <label className="cursor-pointer">
            <Button variant="outline" asChild>
              <span>Import Data</span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>

          {expiredGalleries.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  Cleanup Expired ({expiredGalleries.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cleanup Expired Galleries</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {expiredGalleries.length} expired galleries. 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCleanupExpired}>
                    Delete Expired Galleries
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Gallery List */}
      <div className="space-y-4">
        {filteredGalleries.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-2xl">🔍</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">No galleries found</h4>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first gallery to get started'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredGalleries.map((gallery) => (
            <Card 
              key={gallery.id} 
              className={`transition-all hover:shadow-lg ${
                gallery.isExpired ? 'opacity-60 border-red-200' : ''
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{gallery.name}</CardTitle>
                      <Badge variant={gallery.isExpired ? 'destructive' : 'default'}>
                        {formatTimeRemaining(gallery.expiresAt)}
                      </Badge>
                    </div>
                    <CardDescription>
                      Template: {gallery.template?.name || 'Custom'} • 
                      Created: {formatDate(gallery.createdAt)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Artworks</p>
                    <p className="font-semibold">{gallery.artworks?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Visits</p>
                    <p className="font-semibold">{gallery.visitCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Visited</p>
                    <p className="font-semibold text-sm">
                      {gallery.lastVisited 
                        ? formatDate(gallery.lastVisited)
                        : 'Never'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="font-semibold">
                      {dataManager.formatCurrency(
                        gallery.artworks?.reduce((sum, artwork) => sum + (artwork.price || 0), 0) || 0
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm"
                    onClick={() => onViewGallery(gallery.id)}
                    disabled={gallery.isExpired}
                  >
                    View Gallery
                  </Button>
                  
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => onShareGallery && onShareGallery(gallery.id)}
                  >
                    Share Link
                  </Button>

                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const purchases = dataManager.getPurchasesByGallery(gallery.id);
                      if (purchases.length > 0) {
                        alert(`This gallery has ${purchases.length} purchases totaling ${dataManager.formatCurrency(purchases.reduce((sum, p) => sum + p.paymentInfo.amount, 0))}`);
                      } else {
                        alert('No purchases for this gallery yet.');
                      }
                    }}
                  >
                    Sales Info
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Gallery</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{gallery.name}"? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteGallery(gallery.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Gallery
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

