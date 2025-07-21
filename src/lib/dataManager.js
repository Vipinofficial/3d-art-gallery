// Data Manager for 3D Art Gallery
// Handles local storage, JSON data management, and data persistence

class DataManager {
  constructor() {
    this.STORAGE_KEYS = {
      GALLERIES: 'art_gallery_user_galleries',
      PURCHASES: 'art_gallery_purchases',
      SETTINGS: 'art_gallery_settings',
      VISIT_HISTORY: 'art_gallery_visit_history'
    };
    
    this.initializeData();
  }

  // Initialize data from JSON files and local storage
  async initializeData() {
    try {
      // Load static data from JSON files
      this.templates = await this.loadJSON('/data/galleryTemplates.json');
      this.artPieces = await this.loadJSON('/data/artPieces.json');
      
      // Initialize local storage if empty
      this.initializeLocalStorage();
      
      console.log('Data Manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize data:', error);
      this.handleDataError(error);
    }
  }

  // Load JSON data from files
  async loadJSON(filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading JSON from ${filePath}:`, error);
      return this.getDefaultData(filePath);
    }
  }

  // Get default data if JSON loading fails
  getDefaultData(filePath) {
    if (filePath.includes('galleryTemplates')) {
      return { templates: [] };
    }
    if (filePath.includes('artPieces')) {
      return { artPieces: [], categories: [] };
    }
    return {};
  }

  // Initialize local storage with default values
  initializeLocalStorage() {
    const defaultData = {
      [this.STORAGE_KEYS.GALLERIES]: [],
      [this.STORAGE_KEYS.PURCHASES]: [],
      [this.STORAGE_KEYS.SETTINGS]: {
        theme: 'light',
        notifications: true,
        autoSave: true,
        language: 'en'
      },
      [this.STORAGE_KEYS.VISIT_HISTORY]: []
    };

    Object.entries(defaultData).forEach(([key, defaultValue]) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
      }
    });
  }

  // Generic local storage methods
  getFromStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading from storage (${key}):`, error);
      return null;
    }
  }

  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving to storage (${key}):`, error);
      this.handleStorageError(error);
      return false;
    }
  }

  // Gallery Management Methods
  getAllGalleries() {
    const galleries = this.getFromStorage(this.STORAGE_KEYS.GALLERIES) || [];
    return galleries.map(gallery => ({
      ...gallery,
      isExpired: new Date(gallery.expiresAt) < new Date()
    }));
  }

  getGalleryById(id) {
    const galleries = this.getAllGalleries();
    return galleries.find(gallery => gallery.id === id);
  }

  saveGallery(gallery) {
    const galleries = this.getAllGalleries();
    const existingIndex = galleries.findIndex(g => g.id === gallery.id);
    
    if (existingIndex >= 0) {
      galleries[existingIndex] = gallery;
    } else {
      galleries.push(gallery);
    }
    
    return this.saveToStorage(this.STORAGE_KEYS.GALLERIES, galleries);
  }

  deleteGallery(id) {
    const galleries = this.getAllGalleries();
    const filteredGalleries = galleries.filter(gallery => gallery.id !== id);
    return this.saveToStorage(this.STORAGE_KEYS.GALLERIES, filteredGalleries);
  }

  // Update gallery visit count
  recordGalleryVisit(galleryId) {
    const galleries = this.getAllGalleries();
    const gallery = galleries.find(g => g.id === galleryId);
    
    if (gallery) {
      gallery.visitCount = (gallery.visitCount || 0) + 1;
      gallery.lastVisited = new Date().toISOString();
      this.saveGallery(gallery);
      
      // Also record in visit history
      this.recordVisitHistory(galleryId);
    }
  }

  // Visit History Management
  recordVisitHistory(galleryId) {
    const history = this.getFromStorage(this.STORAGE_KEYS.VISIT_HISTORY) || [];
    const visit = {
      galleryId,
      timestamp: new Date().toISOString(),
      id: `visit_${Date.now()}`
    };
    
    history.unshift(visit);
    
    // Keep only last 100 visits
    if (history.length > 100) {
      history.splice(100);
    }
    
    this.saveToStorage(this.STORAGE_KEYS.VISIT_HISTORY, history);
  }

  getVisitHistory() {
    return this.getFromStorage(this.STORAGE_KEYS.VISIT_HISTORY) || [];
  }

  // Purchase Management Methods
  getAllPurchases() {
    return this.getFromStorage(this.STORAGE_KEYS.PURCHASES) || [];
  }

  savePurchase(purchase) {
    const purchases = this.getAllPurchases();
    purchases.push(purchase);
    
    // Update artwork sold status in galleries
    this.markArtworkAsSold(purchase.artId, purchase.galleryId);
    
    return this.saveToStorage(this.STORAGE_KEYS.PURCHASES, purchases);
  }

  markArtworkAsSold(artId, galleryId) {
    const gallery = this.getGalleryById(galleryId);
    if (gallery) {
      const artwork = gallery.artworks.find(art => art.artId === artId);
      if (artwork) {
        artwork.sold = true;
        artwork.soldAt = new Date().toISOString();
        this.saveGallery(gallery);
      }
    }
  }

  getPurchasesByGallery(galleryId) {
    const purchases = this.getAllPurchases();
    return purchases.filter(purchase => purchase.galleryId === galleryId);
  }

  // Template and Art Piece Methods
  getAllTemplates() {
    return this.templates?.templates || [];
  }

  getTemplateById(id) {
    const templates = this.getAllTemplates();
    return templates.find(template => template.id === id);
  }

  getAllArtPieces() {
    return this.artPieces?.artPieces || [];
  }

  getArtPieceById(id) {
    const artPieces = this.getAllArtPieces();
    return artPieces.find(art => art.id === id);
  }

  getArtPiecesByCategory(category) {
    const artPieces = this.getAllArtPieces();
    return artPieces.filter(art => art.category.toLowerCase() === category.toLowerCase());
  }

  getCategories() {
    return this.artPieces?.categories || [];
  }

  // Settings Management
  getSettings() {
    return this.getFromStorage(this.STORAGE_KEYS.SETTINGS) || {};
  }

  updateSettings(newSettings) {
    const currentSettings = this.getSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    return this.saveToStorage(this.STORAGE_KEYS.SETTINGS, updatedSettings);
  }

  // Data Export/Import Methods
  exportAllData() {
    const data = {
      galleries: this.getAllGalleries(),
      purchases: this.getAllPurchases(),
      settings: this.getSettings(),
      visitHistory: this.getVisitHistory(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData) {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      if (data.galleries) {
        this.saveToStorage(this.STORAGE_KEYS.GALLERIES, data.galleries);
      }
      if (data.purchases) {
        this.saveToStorage(this.STORAGE_KEYS.PURCHASES, data.purchases);
      }
      if (data.settings) {
        this.saveToStorage(this.STORAGE_KEYS.SETTINGS, data.settings);
      }
      if (data.visitHistory) {
        this.saveToStorage(this.STORAGE_KEYS.VISIT_HISTORY, data.visitHistory);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Cleanup expired galleries
  cleanupExpiredGalleries() {
    const galleries = this.getAllGalleries();
    const activeGalleries = galleries.filter(gallery => !gallery.isExpired);
    const expiredCount = galleries.length - activeGalleries.length;
    
    if (expiredCount > 0) {
      this.saveToStorage(this.STORAGE_KEYS.GALLERIES, activeGalleries);
      console.log(`Cleaned up ${expiredCount} expired galleries`);
    }
    
    return expiredCount;
  }

  // Statistics Methods
  getStatistics() {
    const galleries = this.getAllGalleries();
    const purchases = this.getAllPurchases();
    const visitHistory = this.getVisitHistory();
    
    return {
      totalGalleries: galleries.length,
      activeGalleries: galleries.filter(g => !g.isExpired).length,
      expiredGalleries: galleries.filter(g => g.isExpired).length,
      totalPurchases: purchases.length,
      totalRevenue: purchases.reduce((sum, p) => sum + (p.paymentInfo.amount || 0), 0),
      totalVisits: visitHistory.length,
      averageVisitsPerGallery: galleries.length > 0 ? visitHistory.length / galleries.length : 0,
      mostPopularTemplate: this.getMostPopularTemplate(galleries),
      topSellingCategory: this.getTopSellingCategory(purchases)
    };
  }

  getMostPopularTemplate(galleries) {
    const templateCounts = {};
    galleries.forEach(gallery => {
      templateCounts[gallery.templateId] = (templateCounts[gallery.templateId] || 0) + 1;
    });
    
    const mostPopular = Object.entries(templateCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    return mostPopular ? mostPopular[0] : null;
  }

  getTopSellingCategory(purchases) {
    const categoryCounts = {};
    purchases.forEach(purchase => {
      const artwork = this.getArtPieceById(purchase.artId);
      if (artwork) {
        categoryCounts[artwork.category] = (categoryCounts[artwork.category] || 0) + 1;
      }
    });
    
    const topSelling = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    return topSelling ? topSelling[0] : null;
  }

  // Error Handling
  handleDataError(error) {
    console.error('Data Manager Error:', error);
    // Could implement fallback data loading or user notification here
  }

  handleStorageError(error) {
    if (error.name === 'QuotaExceededError') {
      console.warn('Local storage quota exceeded. Cleaning up old data...');
      this.cleanupOldData();
    }
  }

  cleanupOldData() {
    // Remove old visit history
    const history = this.getVisitHistory();
    if (history.length > 50) {
      const recentHistory = history.slice(0, 50);
      this.saveToStorage(this.STORAGE_KEYS.VISIT_HISTORY, recentHistory);
    }
    
    // Remove expired galleries
    this.cleanupExpiredGalleries();
  }

  // Utility Methods
  generateId(prefix = 'item') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
  }

  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
}

// Create and export singleton instance
const dataManager = new DataManager();
export default dataManager;

