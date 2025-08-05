'use client';

import { useState } from 'react';
import { R2StyleSwiper } from '@/components/style/R2StyleSwiper';
import { StyleSwiperImage, SwipeAnalytics } from '@/lib/types';
import { ArrowLeft, Sparkles, Upload } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { value: 'all', label: 'All Styles' },
  { value: 'suits', label: 'Suits & Tuxedos' },
  { value: 'shirts', label: 'Shirts' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'trending', label: 'Trending' },
  { value: 'seasonal', label: 'Seasonal' },
];

export default function StyleSwiperR2Page() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [swipeData, setSwipeData] = useState<any[]>([]);
  const [completedProfiles, setCompletedProfiles] = useState<any[]>([]);

  const handleSwipe = (image: StyleSwiperImage, direction: 'left' | 'right', velocity?: number) => {
    console.log(`Swiped ${direction} on image ${image.id}`, velocity && `at ${velocity.toFixed(0)}px/s`);
    setSwipeData(prev => [...prev, { 
      imageId: image.id, 
      category: image.category,
      direction, 
      velocity, 
      timestamp: Date.now() 
    }]);
  };

  const handleComplete = (likedImages: StyleSwiperImage[], analytics: SwipeAnalytics) => {
    console.log('Completed with liked images:', likedImages);
    console.log('Analytics:', analytics);
    setCompletedProfiles(prev => [...prev, { 
      likedImages, 
      analytics, 
      category: selectedCategory,
      completedAt: new Date().toISOString()
    }]);
  };

  const handleProductClick = (productId: string) => {
    console.log('Product clicked:', productId);
    // In a real app, navigate to product page or open quick view
    // window.location.href = `/products/${productId}`;
  };

  const resetDemo = () => {
    setSwipeData([]);
    setCompletedProfiles([]);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
            
            <Link 
              href="/admin/style-swiper" 
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Upload className="w-4 h-4" />
              Manage Images
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-amber-600 mb-4">
            <div className="h-px w-12 bg-amber-600"></div>
            <span className="text-sm font-semibold tracking-widest uppercase">Powered by Cloudflare R2</span>
            <div className="h-px w-12 bg-amber-600"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Smart Style Discovery</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience our AI-powered style matcher with lightning-fast image delivery from Cloudflare R2
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Swiper Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Style Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            <R2StyleSwiper
              key={`${selectedCategory}-${completedProfiles.length}`}
              category={selectedCategory}
              onSwipe={handleSwipe}
              onComplete={handleComplete}
              onProductClick={handleProductClick}
              enableHaptics={true}
              preloadImages={true}
            />
          </div>

          {/* Analytics & Info */}
          <div className="space-y-6">
            {/* Features */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-serif mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                R2 Integration Features
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <strong>Global CDN Delivery:</strong> Images served from Cloudflare's edge network for blazing-fast performance
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <strong>Smart Categorization:</strong> Images organized by style categories for personalized discovery
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <strong>Product Linking:</strong> Each style can be linked to actual products for instant shopping
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <strong>Analytics Tracking:</strong> Detailed swipe analytics to understand style preferences
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <strong>Admin Interface:</strong> Easy upload and management of style images
                  </div>
                </div>
              </div>
            </div>

            {/* Live Swipe Data */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-serif mb-4">Live Swipe Data</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {swipeData.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Start swiping to see data</p>
                ) : (
                  swipeData.slice(-5).reverse().map((data, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm">
                        <span className="font-medium">{data.category}</span> image
                      </span>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${data.direction === 'right' ? 'text-green-600' : 'text-red-600'}`}>
                          {data.direction === 'right' ? 'Liked' : 'Passed'}
                        </span>
                        {data.velocity && (
                          <span className="text-xs text-gray-500">
                            {Math.abs(data.velocity).toFixed(0)}px/s
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {swipeData.length > 0 && (
                <button
                  onClick={() => setSwipeData([])}
                  className="mt-4 text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  Clear Data
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="bg-amber-50 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-serif mb-4">Next Steps</h3>
              <div className="space-y-3">
                <Link 
                  href="/admin/style-swiper"
                  className="block w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium text-center transition-colors"
                >
                  Upload Your Style Images
                </Link>
                <button
                  onClick={resetDemo}
                  className="block w-full bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-medium border border-gray-300 transition-colors"
                >
                  Reset Demo
                </button>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium mb-1">How to set up:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Add R2 credentials to your .env file</li>
                  <li>Upload images via the admin interface</li>
                  <li>Link images to products (optional)</li>
                  <li>Integrate with your style quiz flow</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Profiles */}
        {completedProfiles.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-serif mb-6">Completed Style Profiles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {completedProfiles.map((profile, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">
                    {profile.category === 'all' ? 'All Categories' : profile.category} Profile
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Liked {profile.likedImages.length} styles
                  </p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <p>Total swipes: {profile.analytics.totalSwipes}</p>
                    <p>Like rate: {((profile.analytics.rightSwipes / profile.analytics.totalSwipes) * 100).toFixed(0)}%</p>
                    <p>Avg swipe time: {(profile.analytics.averageSwipeTime / 1000).toFixed(1)}s</p>
                    <p>Undo count: {profile.analytics.undoCount}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {Object.entries(profile.analytics.categoryPreferences)
                      .filter(([_, score]) => score > 0)
                      .map(([cat, score]) => (
                        <span key={cat} className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs">
                          {cat}: +{score}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}