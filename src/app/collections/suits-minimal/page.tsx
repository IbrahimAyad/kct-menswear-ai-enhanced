'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  X, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Product categories with your specified images
const productCategories = [
  {
    id: 'shirts',
    name: 'Shirts',
    price: 89,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/dress_shirts/stretch_collar/mens_dress_shirt_stretch_collar_model_3005_0.webp',
    products: [
      {
        id: 'shirt-1',
        name: 'Stretch Collar Dress Shirt',
        price: 89,
        images: [
          'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/dress_shirts/stretch_collar/mens_dress_shirt_stretch_collar_model_3005_0.webp'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        color: 'White',
        description: 'Premium stretch collar for all-day comfort'
      }
    ]
  },
  {
    id: 'turtleneck',
    name: 'Turtleneck',
    price: 79,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/dress_shirts/turtle_neck/mens_dress_shirt_turtle_neck_3002_0.webp',
    products: [
      {
        id: 'turtle-1',
        name: 'Classic Turtleneck',
        price: 79,
        images: [
          'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/dress_shirts/turtle_neck/mens_dress_shirt_turtle_neck_3002_0.webp',
          'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9ac91a19-5951-43d4-6a98-c9d658765c00/public'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        color: 'Black',
        description: 'Sophisticated turtleneck for layered looks'
      }
    ]
  },
  {
    id: 'velvet-blazers',
    name: 'Velvet Blazers',
    price: 299,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/velvet-blazer/mens_green_paisley_pattern_velvet_model_1089.webp',
    products: [
      {
        id: 'velvet-1',
        name: 'Green Paisley Velvet Blazer',
        price: 299,
        images: [
          'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/velvet-blazer/mens_green_paisley_pattern_velvet_model_1089.webp'
        ],
        sizes: ['36', '38', '40', '42', '44', '46'],
        color: 'Emerald Green',
        description: 'Luxurious velvet blazer with paisley pattern'
      }
    ]
  },
  {
    id: 'blazers',
    name: 'Blazers',
    price: 249,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/prom_blazer/mens_red_floral_pattern_prom_blazer_model_1018.webp',
    products: [
      {
        id: 'blazer-1',
        name: 'Red Floral Prom Blazer',
        price: 249,
        images: [
          'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/prom_blazer/mens_red_floral_pattern_prom_blazer_model_1018.webp'
        ],
        sizes: ['36', '38', '40', '42', '44', '46'],
        color: 'Red Floral',
        description: 'Statement blazer with bold floral pattern'
      }
    ]
  },
  {
    id: 'suspender-bowtie',
    name: 'Suspender & Bowtie',
    price: 59,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/powder-blue-model.png',
    products: [
      {
        id: 'suspender-1',
        name: 'Powder Blue Suspender Set',
        price: 59,
        images: [
          'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/powder-blue-model.png'
        ],
        sizes: ['One Size'],
        color: 'Powder Blue',
        description: 'Complete suspender and bowtie set'
      }
    ]
  },
  {
    id: 'knitwear',
    name: 'Knitwear',
    price: 129,
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9ac91a19-5951-43d4-6a98-c9d658765c00/public',
    products: [
      {
        id: 'knit-1',
        name: 'Premium Knit Turtleneck',
        price: 129,
        images: [
          'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9ac91a19-5951-43d4-6a98-c9d658765c00/public'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        color: 'Black',
        description: 'Luxurious knit for sophisticated styling'
      }
    ]
  },
  {
    id: 'dress-shirts',
    name: 'Dress Shirts',
    price: 79,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/dress_shirts/stretch_collar/mens_dress_shirt_stretch_collar_model_3005_0.webp',
    products: [
      {
        id: 'dress-1',
        name: 'Classic Dress Shirt',
        price: 79,
        images: [
          'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/dress_shirts/stretch_collar/mens_dress_shirt_stretch_collar_model_3005_0.webp'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        color: 'White',
        description: 'Essential dress shirt for any occasion'
      }
    ]
  },
  {
    id: 'vests',
    name: 'Vests',
    price: 99,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/vest-tie-main-2.jpg',
    products: [
      {
        id: 'vest-1',
        name: 'Burgundy Formal Vest',
        price: 99,
        images: [
          'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/vest-tie-main-2.jpg'
        ],
        sizes: ['36', '38', '40', '42', '44', '46'],
        color: 'Burgundy',
        description: 'Classic vest for formal occasions'
      }
    ]
  },
  {
    id: 'vest-tie',
    name: 'Vest & Tie',
    price: 119,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dusty-sage-model.png',
    products: [
      {
        id: 'vest-tie-1',
        name: 'Dusty Sage Vest & Tie Set',
        price: 119,
        images: [
          'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dusty-sage-model.png'
        ],
        sizes: ['36', '38', '40', '42', '44', '46'],
        color: 'Dusty Sage',
        description: 'Coordinated vest and tie combination'
      }
    ]
  },
  {
    id: 'shoes',
    name: 'Shoes',
    price: 189,
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/7d203d2a-63b7-46d3-9749-1f203e4ccc00/public',
    products: [
      {
        id: 'shoe-1',
        name: 'Oxford Dress Shoes',
        price: 189,
        images: [
          'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/7d203d2a-63b7-46d3-9749-1f203e4ccc00/public'
        ],
        sizes: ['7', '8', '9', '10', '11', '12'],
        color: 'Black',
        description: 'Classic oxford shoes for formal wear'
      }
    ]
  },
  {
    id: 'double-breasted',
    name: 'Double Breasted',
    price: 329,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/double_breasted/mens_double_breasted_suit_model_2024_0.webp',
    products: [
      {
        id: 'db-1',
        name: 'Double Breasted Suit',
        price: 329,
        images: [
          'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/double_breasted/mens_double_breasted_suit_model_2024_0.webp'
        ],
        sizes: ['36', '38', '40', '42', '44', '46'],
        color: 'Navy',
        description: 'Classic double breasted suit with peak lapels'
      }
    ]
  },
  {
    id: 'shirt-tie',
    name: 'Shirt & Tie',
    price: 109,
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/dd5c1f7d-722d-4e17-00be-60a3fdb33900/public',
    products: [
      {
        id: 'shirt-tie-1',
        name: 'Shirt & Tie Combo',
        price: 109,
        images: [
          'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/dd5c1f7d-722d-4e17-00be-60a3fdb33900/public'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        color: 'White & Blue',
        description: 'Perfectly matched shirt and tie combination'
      }
    ]
  }
];

export default function MinimalistSuitsCollection() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Toggle like
  const toggleLike = (productId: string) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // Handle quick view
  const handleQuickView = (category: typeof productCategories[0]) => {
    // For now, show the first product in the category
    setSelectedProduct(category.products[0]);
    setCurrentImageIndex(0);
    setSelectedSize('');
    setQuantity(1);
  };

  // Close modal when clicking outside
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setSelectedProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Category Grid - 3x3 on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-1 md:gap-2 p-1 md:p-3">
        {productCategories.map((category) => (
          <motion.div
            key={category.id}
            className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group"
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Product Image */}
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Category Info */}
            <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
              <h3 className="text-white font-serif text-sm md:text-lg mb-0.5">
                {category.name}
              </h3>
              <p className="text-white/90 text-sm md:text-base font-medium">
                ${category.price}
              </p>
            </div>

            {/* Quick View Button - Bottom Right */}
            <motion.button
              onClick={() => handleQuickView(category)}
              className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-white/90 backdrop-blur text-black px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-medium flex items-center gap-0.5 md:gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-3 h-3" />
              <span className="hidden md:inline">Quick View</span>
              <span className="md:hidden">View</span>
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Quick View Modal - Not Full Screen */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={handleModalClick}
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={selectedProduct.images[currentImageIndex]}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover rounded-t-2xl"
                />
                
                {/* Image Navigation Dots */}
                {selectedProduct.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {selectedProduct.images.map((_: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all",
                          index === currentImageIndex 
                            ? "bg-white w-4" 
                            : "bg-white/50"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-serif mb-1">{selectedProduct.name}</h2>
                    <p className="text-gray-600 text-sm">{selectedProduct.description}</p>
                  </div>
                  <button
                    onClick={() => toggleLike(selectedProduct.id)}
                    className="p-2"
                  >
                    <Heart 
                      className={cn(
                        "w-5 h-5 transition-all",
                        likedProducts.has(selectedProduct.id) 
                          ? "text-red-500 fill-red-500" 
                          : "text-gray-400"
                      )} 
                    />
                  </button>
                </div>

                {/* Price */}
                <div className="text-2xl font-semibold mb-4">
                  ${selectedProduct.price}
                </div>

                {/* Size Selector */}
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-4 py-2 border rounded-lg text-sm transition-all",
                          selectedSize === size
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-gray-400"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <p className="text-sm text-gray-700 mb-2">Quantity</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Add to Bag Button */}
                <Button
                  className="w-full bg-black hover:bg-gray-800 text-white py-3"
                  disabled={!selectedSize}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add to Bag
                </Button>

                {/* View Details Link */}
                <Link 
                  href={`/products/${selectedProduct.id}`}
                  className="block text-center text-sm text-gray-600 mt-3 hover:text-black transition-colors"
                >
                  View Full Details
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}