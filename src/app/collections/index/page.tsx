'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// All master collections with metadata
const masterCollections = [
  {
    id: 'suits',
    name: 'Suits',
    description: 'Classic to contemporary suits for every occasion',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/classic-suits.webp',
    href: '/collections/suits',
    productCount: 89
  },
  {
    id: 'blazers',
    name: 'Blazers & Jackets',
    description: 'Precision-tailored blazers in timeless colors',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/jackets.webp',
    href: '/collections/blazers',
    productCount: 124
  },
  {
    id: 'shirts',
    name: 'Shirts',
    description: 'From dress shirts to casual styles',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/shirts.webp',
    href: '/collections/shirts',
    productCount: 96
  },
  {
    id: 'knitwear',
    name: 'Knitwear & Sweaters',
    description: 'Luxurious merino wool and cashmere',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/knitwear.webp',
    href: '/collections/knitwear',
    productCount: 96
  },
  {
    id: 'formal',
    name: 'Formal & Tuxedos',
    description: 'Black-tie and formal occasion wear',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/black-tux-main.jpg',
    href: '/collections/formal',
    productCount: 84
  },
  {
    id: 'wedding',
    name: 'Wedding Collection',
    description: 'Complete wedding party attire',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/wedding-suits.webp',
    href: '/collections/wedding',
    productCount: 78
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Ties, bowties, pocket squares and more',
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/burgundy.jpg',
    href: '/collections/accessories',
    productCount: 245
  },
  {
    id: 'shoes',
    name: 'Shoes & Footwear',
    description: 'Statement loafers and dress shoes',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/shoes.webp',
    href: '/collections/shoes',
    productCount: 78
  }
];

export default function CollectionsIndexPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 px-4 py-12 md:px-8 md:py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Master Collections</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our complete range of premium menswear, from classic suits to modern accessories.
            Each collection is carefully curated to enhance every aspect of your wardrobe.
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {masterCollections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={collection.href}>
                <div className="group cursor-pointer">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    {/* Product Count Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full">
                      <span className="text-sm font-medium">{collection.productCount} items</span>
                    </div>
                    
                    {/* View Collection Button - Shows on Hover */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-full bg-white/90 backdrop-blur text-black py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-white transition-colors">
                        View Collection
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Collection Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-gray-700 transition-colors">
                      {collection.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {collection.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="bg-gray-50 px-4 py-12 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-serif mb-6 text-center">Quick Links</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {masterCollections.map((collection) => (
              <Link
                key={collection.id}
                href={collection.href}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-black hover:text-white transition-colors"
              >
                {collection.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-4 py-12 md:px-8 border-t">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold mb-1">8</div>
            <div className="text-sm text-gray-600">Master Collections</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">1,000+</div>
            <div className="text-sm text-gray-600">Products</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">59</div>
            <div className="text-sm text-gray-600">Color Options</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">34-54</div>
            <div className="text-sm text-gray-600">Size Range</div>
          </div>
        </div>
      </div>
    </div>
  );
}