'use client';

import { useState } from 'react';
import Image from 'next/image';

interface OutfitConfig {
  tieColor: string;
  tieStyle: 'bowtie' | 'classic' | 'skinny' | 'slim';
  suitColor: string;
  shirtColor: string;
  occasion: 'wedding' | 'business' | 'prom' | 'casual';
}

export default function BundleGenerator() {
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [config, setConfig] = useState<OutfitConfig>({
    tieColor: 'navy',
    tieStyle: 'classic',
    suitColor: 'charcoal grey',
    shirtColor: 'white',
    occasion: 'business'
  });

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bundle-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate outfit');
      }
      
      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Bundle Outfit Generator</h2>
      
      {/* Configuration Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tie Color</label>
            <input
              type="text"
              value={config.tieColor}
              onChange={(e) => setConfig({...config, tieColor: e.target.value})}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., burgundy, navy, emerald green"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tie Style</label>
            <select
              value={config.tieStyle}
              onChange={(e) => setConfig({...config, tieStyle: e.target.value as any})}
              className="w-full border rounded px-3 py-2"
            >
              <option value="bowtie">Bowtie</option>
              <option value="classic">Classic (3.25")</option>
              <option value="skinny">Skinny (2.75")</option>
              <option value="slim">Slim (2.25")</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Suit Color</label>
            <input
              type="text"
              value={config.suitColor}
              onChange={(e) => setConfig({...config, suitColor: e.target.value})}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., charcoal grey, navy, black"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Shirt Color</label>
            <input
              type="text"
              value={config.shirtColor}
              onChange={(e) => setConfig({...config, shirtColor: e.target.value})}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., white, light blue, pink"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Occasion</label>
            <select
              value={config.occasion}
              onChange={(e) => setConfig({...config, occasion: e.target.value as any})}
              className="w-full border rounded px-3 py-2"
            >
              <option value="wedding">Wedding</option>
              <option value="business">Business</option>
              <option value="prom">Prom</option>
              <option value="casual">Casual</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? 'Generating Outfit...' : 'Generate Bundle Outfit'}
        </button>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Generated Image */}
      {imageUrl && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Generated Outfit</h3>
          <div className="relative aspect-[3/4] max-w-md mx-auto">
            <Image
              src={imageUrl}
              alt="Generated outfit"
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Configuration:</strong></p>
            <ul className="mt-2 space-y-1">
              <li>Tie: {config.tieColor} {config.tieStyle}</li>
              <li>Suit: {config.suitColor}</li>
              <li>Shirt: {config.shirtColor}</li>
              <li>Occasion: {config.occasion}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}