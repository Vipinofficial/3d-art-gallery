import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">3D Art Gallery - Test</h1>
          <p className="text-sm text-gray-600">Testing basic functionality</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl text-white">
          <h2 className="text-4xl font-bold mb-4">Welcome to 3D Art Gallery</h2>
          <p className="text-xl mb-8 opacity-90">
            Create immersive virtual exhibitions featuring traditional Indian art forms
          </p>
          <button className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold">
            Test Button
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;

