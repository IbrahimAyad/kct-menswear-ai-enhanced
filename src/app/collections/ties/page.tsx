'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { tieProducts } from '@/lib/products/tieProducts';
import { TiesCollectionSEO } from '@/components/seo/TiesCollectionSEO';

export default function TiesCollectionPage() {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <TiesCollectionSEO />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Premium Ties & Bowties Collection
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Explore our extensive collection of premium silk ties and bowties in over 80 colors. 
              Available in Classic (3.25"), Skinny (2.75"), Slim (2.25"), and Pre-tied Bowtie styles.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Bundle Promotion Banner */}
      <section className="bg-blue-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg font-medium">
            🎉 Bundle & Save: Buy 4 Get 1 Free | Buy 6 Get 2 Free | Buy 8 Get 3 Free
          </p>
        </div>
      </section>

      {/* Colors Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Choose Your Color
            </h2>
            <p className="text-gray-600">
              Click any color to explore all available styles
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {tieProducts.colors.map((color, index) => (
              <motion.div
                key={color.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                <Link
                  href={`/collections/ties/${color.id}-collection`}
                  className="group block relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                  onMouseEnter={() => setHoveredColor(color.id)}
                  onMouseLeave={() => setHoveredColor(null)}
                >
                  <div className="aspect-square relative bg-gray-100">
                    <Image
                      src={color.imageUrl}
                      alt={color.displayName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16.66vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-medium text-sm">{color.name}</h3>
                    <p className="text-xs opacity-90">4 Styles Available</p>
                  </div>

                  {/* Color indicator */}
                  <div 
                    className="absolute top-3 right-3 w-8 h-8 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: color.hex }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">80+ Colors</h3>
              <p className="text-gray-600">
                From classic navy to vibrant coral, find the perfect color for any occasion
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2">4 Styles</h3>
              <p className="text-gray-600">
                Classic (3.25"), Skinny (2.75"), Slim (2.25"), and Pre-tied Bowties
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Bundle Savings</h3>
              <p className="text-gray-600">
                Save up to 27% with our mix & match bundle deals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Colors Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Popular Colors by Occasion</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold mb-3">Wedding</h3>
              <div className="space-y-2">
                <Link href="/collections/ties/navy-collection" className="block text-sm hover:text-blue-600">Navy Blue</Link>
                <Link href="/collections/ties/burgundy-collection" className="block text-sm hover:text-blue-600">Burgundy</Link>
                <Link href="/collections/ties/blush-pink-collection" className="block text-sm hover:text-blue-600">Blush Pink</Link>
                <Link href="/collections/ties/silver-collection" className="block text-sm hover:text-blue-600">Silver</Link>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold mb-3">Business</h3>
              <div className="space-y-2">
                <Link href="/collections/ties/black-collection" className="block text-sm hover:text-blue-600">Black</Link>
                <Link href="/collections/ties/charcoal-collection" className="block text-sm hover:text-blue-600">Charcoal</Link>
                <Link href="/collections/ties/dark-grey-collection" className="block text-sm hover:text-blue-600">Dark Grey</Link>
                <Link href="/collections/ties/red-collection" className="block text-sm hover:text-blue-600">Power Red</Link>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold mb-3">Prom</h3>
              <div className="space-y-2">
                <Link href="/collections/ties/royal-blue-collection" className="block text-sm hover:text-blue-600">Royal Blue</Link>
                <Link href="/collections/ties/emerald-green-collection" className="block text-sm hover:text-blue-600">Emerald Green</Link>
                <Link href="/collections/ties/gold-collection" className="block text-sm hover:text-blue-600">Gold</Link>
                <Link href="/collections/ties/coral-collection" className="block text-sm hover:text-blue-600">Coral</Link>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold mb-3">Casual</h3>
              <div className="space-y-2">
                <Link href="/collections/ties/mint-green-collection" className="block text-sm hover:text-blue-600">Mint Green</Link>
                <Link href="/collections/ties/lavender-collection" className="block text-sm hover:text-blue-600">Lavender</Link>
                <Link href="/collections/ties/powder-blue-collection" className="block text-sm hover:text-blue-600">Powder Blue</Link>
                <Link href="/collections/ties/teal-collection" className="block text-sm hover:text-blue-600">Teal</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Size Guide Preview */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Tie Style Guide</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-4 mb-3">
                  <div className="w-16 h-32 bg-gray-700 mx-auto rounded" />
                </div>
                <h3 className="font-bold">Classic</h3>
                <p className="text-sm text-gray-600">3.25" width</p>
                <p className="text-xs mt-1">Traditional formal</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-4 mb-3">
                  <div className="w-12 h-32 bg-gray-700 mx-auto rounded" />
                </div>
                <h3 className="font-bold">Skinny</h3>
                <p className="text-sm text-gray-600">2.75" width</p>
                <p className="text-xs mt-1">Modern professional</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-4 mb-3">
                  <div className="w-8 h-32 bg-gray-700 mx-auto rounded" />
                </div>
                <h3 className="font-bold">Slim</h3>
                <p className="text-sm text-gray-600">2.25" width</p>
                <p className="text-xs mt-1">Fashion-forward</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-4 mb-3">
                  <div className="w-20 h-12 bg-gray-700 mx-auto rounded-full" />
                </div>
                <h3 className="font-bold">Bowtie</h3>
                <p className="text-sm text-gray-600">Adjustable</p>
                <p className="text-xs mt-1">Black-tie events</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🚚</div>
              <h3 className="font-bold">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over $75</p>
            </div>
            <div>
              <div className="text-3xl mb-2">↩️</div>
              <h3 className="font-bold">Easy Returns</h3>
              <p className="text-sm text-gray-600">30-day return policy</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🏪</div>
              <h3 className="font-bold">Local Store</h3>
              <p className="text-sm text-gray-600">Visit us in Detroit</p>
            </div>
            <div>
              <div className="text-3xl mb-2">💯</div>
              <h3 className="font-bold">Quality Guarantee</h3>
              <p className="text-sm text-gray-600">Premium silk materials</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-bold mb-2">What tie width should I choose?</h3>
              <p className="text-gray-600 text-sm">
                Classic (3.25") is perfect for traditional formal wear. Skinny (2.75") offers a modern professional look. 
                Slim (2.25") is ideal for fashion-forward styling. Choose based on your lapel width and personal style.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-bold mb-2">How do I match my tie color?</h3>
              <p className="text-gray-600 text-sm">
                For formal events, match your tie to your date's dress or wedding colors. 
                For business, stick to classic colors like navy, burgundy, or charcoal. 
                For casual wear, experiment with patterns and brighter colors.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-bold mb-2">Can I mix different styles in a bundle?</h3>
              <p className="text-gray-600 text-sm">
                Yes! Our bundle builder lets you mix and match any combination of colors and styles. 
                Choose from Classic, Skinny, Slim, or Bowtie styles in any of our 80+ colors.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-bold mb-2">What material are your ties made from?</h3>
              <p className="text-gray-600 text-sm">
                All our ties are crafted from premium quality silk with a luxurious finish. 
                They feature a durable interlining for the perfect knot and drape.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}