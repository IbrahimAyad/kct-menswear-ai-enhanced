"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TrendingProduct {
  id: string;
  brand: string;
  name: string;
  originalPrice?: number;
  salePrice?: number;
  currentPrice: number;
  image: string;
  href: string;
  isNew?: boolean;
  discount?: string;
}

const trendingProducts: Record<string, TrendingProduct[]> = {
  men: [
    {
      id: "1",
      brand: "HUGO",
      name: "INTERLOCK-COTTON REGULAR-FIT T-SHIRT WITH...",
      originalPrice: 90.00,
      salePrice: 70.00,
      currentPrice: 70.00,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      href: "/products/hugo-interlock-tshirt",
      discount: "-22%"
    },
    {
      id: "2", 
      brand: "HUGO",
      name: "ITALIAN-MADE SLIDES WITH CONTRAST-LOGO...",
      currentPrice: 60.00,
      image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80",
      href: "/products/hugo-slides"
    },
    {
      id: "3",
      brand: "HUGO",
      name: "OVERSIZE-FIT T-SHIRT IN COTTON WITH DECORATIV...",
      originalPrice: 79.00,
      salePrice: 47.00,
      currentPrice: 47.00,
      image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
      href: "/products/hugo-oversize-tshirt",
      discount: "-40%"
    },
    {
      id: "4",
      brand: "HUGO",
      name: "RELAXED-FIT T-SHIRT IN COTTON WITH LOGO...",
      originalPrice: 69.00,
      salePrice: 34.00,
      currentPrice: 34.00,
      image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
      href: "/products/hugo-relaxed-tshirt",
      discount: "-51%"
    },
    {
      id: "5",
      brand: "HUGO",
      name: "STRETCH-COTTON SLIM-FIT POLO SHIRT WITH...",
      originalPrice: 129.00,
      salePrice: 74.00,
      currentPrice: 74.00,
      image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&q=80",
      href: "/products/hugo-polo-shirt",
      discount: "-43%"
    }
  ],
  women: [
    {
      id: "w1",
      brand: "HUGO",
      name: "RELAXED-FIT DRESS IN STRETCH FABRIC",
      originalPrice: 199.00,
      salePrice: 139.00,
      currentPrice: 139.00,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
      href: "/products/hugo-dress",
      discount: "-30%"
    },
    {
      id: "w2",
      brand: "HUGO",
      name: "CROPPED BLAZER IN STRETCH CREPE",
      currentPrice: 249.00,
      image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&q=80",
      href: "/products/hugo-blazer",
      isNew: true
    },
    {
      id: "w3",
      brand: "HUGO",
      name: "HIGH-WAISTED TROUSERS IN VIRGIN WOOL",
      originalPrice: 179.00,
      salePrice: 89.00,
      currentPrice: 89.00,
      image: "https://images.unsplash.com/photo-1594633312954-59c4c89fc074?w=800&q=80",
      href: "/products/hugo-trousers",
      discount: "-50%"
    }
  ],
  kids: [
    {
      id: "k1",
      brand: "HUGO",
      name: "KIDS LOGO T-SHIRT IN COTTON JERSEY",
      currentPrice: 39.00,
      image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80",
      href: "/products/hugo-kids-tshirt"
    },
    {
      id: "k2",
      brand: "HUGO",
      name: "KIDS TRACK JACKET WITH LOGO TAPE",
      originalPrice: 89.00,
      salePrice: 59.00,
      currentPrice: 59.00,
      image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
      href: "/products/hugo-kids-jacket",
      discount: "-34%"
    }
  ]
};

export function TrendingNow() {
  const [activeTab, setActiveTab] = useState<"men" | "women" | "kids">("men");
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const products = trendingProducts[activeTab];
  const itemsPerPage = 5;
  const maxIndex = Math.max(0, products.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight mb-6">TRENDING NOW</h2>
          
          {/* Tab Navigation */}
          <div className="flex justify-center gap-12">
            <button
              onClick={() => {
                setActiveTab("men");
                setCurrentIndex(0);
              }}
              className={`text-sm font-semibold tracking-wider transition-all pb-2 ${
                activeTab === "men" 
                  ? "text-black border-b-2 border-black" 
                  : "text-gray-500 hover:text-black"
              }`}
            >
              MEN
            </button>
            <button
              onClick={() => {
                setActiveTab("women");
                setCurrentIndex(0);
              }}
              className={`text-sm font-semibold tracking-wider transition-all pb-2 ${
                activeTab === "women" 
                  ? "text-black border-b-2 border-black" 
                  : "text-gray-500 hover:text-black"
              }`}
            >
              WOMEN
            </button>
            <button
              onClick={() => {
                setActiveTab("kids");
                setCurrentIndex(0);
              }}
              className={`text-sm font-semibold tracking-wider transition-all pb-2 ${
                activeTab === "kids" 
                  ? "text-black border-b-2 border-black" 
                  : "text-gray-500 hover:text-black"
              }`}
            >
              KIDS
            </button>
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          
          {currentIndex < maxIndex && (
            <button
              onClick={handleNext}
              className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Products Grid */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
            >
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={product.href}
                  className="min-w-[20%] px-2 group"
                >
                  <div className="relative">
                    {/* Discount Badge */}
                    {product.discount && (
                      <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1">
                        {product.discount}
                      </span>
                    )}
                    
                    {/* New Badge */}
                    {product.isNew && (
                      <span className="absolute top-2 left-2 z-10 bg-black text-white text-xs font-bold px-2 py-1">
                        NEW
                      </span>
                    )}

                    {/* Product Image */}
                    <div className="aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Brand */}
                    <p className="text-red-600 font-bold text-xs mb-2">{product.brand}</p>

                    {/* Product Name */}
                    <h3 className="text-xs font-medium mb-3 line-clamp-2 min-h-[2.5rem] uppercase tracking-wide">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through text-sm">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className={`text-sm font-bold ${product.salePrice ? 'text-red-600' : 'text-black'}`}>
                        ${product.currentPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}