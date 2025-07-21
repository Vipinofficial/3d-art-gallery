import React from 'react';
import { Button } from './components/ui/button';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4">3D Art Gallery - Minimal Test</h1>
      <p className="mb-4">Testing basic component imports</p>
      <Button onClick={() => alert('Button works!')}>
        Test Button
      </Button>
    </div>
  );
}

export default App;

