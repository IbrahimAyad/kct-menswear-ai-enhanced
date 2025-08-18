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
  suits: [
    {
      id: "suit-1",
      brand: "KCT MENSWEAR",
      name: "GOLD SEQUIN PATTERN PROM BLAZER",
      originalPrice: 549.00,
      salePrice: 429.00,
      currentPrice: 429.00,
      image: "https://pub-7cf4fd2172224c91aca2d3399692e862.r2.dev/blazers/prom/mens-gold-sequin-pattern-prom-blazer/front.webp",
      href: "/collections/prom/prom-blazers/gold-sequin",
      discount: "-22%"
    },
    {
      id: "suit-2",
      brand: "KCT MENSWEAR",
      name: "EMERALD VELVET DINNER JACKET",
      currentPrice: 649.00,
      image: "https://pub-7cf4fd2172224c91aca2d3399692e862.r2.dev/blazers/velvet/mens-emerald-velvet-dinner-jacket/front.webp",
      href: "/collections/suits/tuxedos/emerald-velvet",
      isNew: true
    },
    {
      id: "suit-3",
      brand: "KCT MENSWEAR",
      name: "DOUBLE BREASTED CLASSIC SUIT",
      originalPrice: 599.00,
      salePrice: 449.00,
      currentPrice: 449.00,
      image: "https://pub-7cf4fd2172224c91aca2d3399692e862.r2.dev/double_breasted/mens_double_breasted_suit_model_2024_0.webp",
      href: "/collections/suits/double-breasted/classic",
      discount: "-25%"
    },
    {
      id: "suit-4",
      brand: "KCT MENSWEAR",
      name: "RED FLORAL PATTERN PROM BLAZER",
      originalPrice: 529.00,
      salePrice: 399.00,
      currentPrice: 399.00,
      image: "https://pub-7cf4fd2172224c91aca2d3399692e862.r2.dev/prom_blazer/mens_red_floral_pattern_prom_blazer_model_1018.webp",
      href: "/collections/prom/prom-blazers/red-floral",
      discount: "-25%"
    }
  ],
  shirts: [
    {
      id: "shirt-1",
      brand: "KCT MENSWEAR",
      name: "STRETCH COLLAR DRESS SHIRT",
      originalPrice: 89.00,
      salePrice: 69.00,
      currentPrice: 69.00,
      image: "https://pub-7cf4fd2172224c91aca2d3399692e862.r2.dev/dress_shirts/stretch_collar/mens_dress_shirt_stretch_collar_model_3005_0.webp",
      href: "/collections/accessories/dress-shirts/stretch-collar",
      discount: "-22%"
    }
  ],
  accessories: [
    {
      id: "acc-1",
      brand: "KCT MENSWEAR",
      name: "DUSTY SAGE VEST & TIE SET",
      originalPrice: 89.00,
      salePrice: 67.00,
      currentPrice: 67.00,
      image: "https://pub-7cf4fd2172224c91aca2d3399692e862.r2.dev/main-solid-vest-tie/dusty-sage-model.png",
      href: "/collections/accessories/vest-and-tie/dusty-sage",
      discount: "-25%"
    },
    {
      id: "acc-2",
      brand: "KCT MENSWEAR",
      name: "POWDER BLUE VEST & TIE SET",
      currentPrice: 79.00,
      image: "https://pub-7cf4fd2172224c91aca2d3399692e862.r2.dev/main-solid-vest-tie/powder-blue-model.png",
      href: "/collections/accessories/vest-and-tie/powder-blue",
      isNew: true
    },
    {
      id: "acc-3",
      brand: "KCT MENSWEAR",
      name: "POWDER BLUE SUSPENDER & BOWTIE SET",
      originalPrice: 59.00,
      salePrice: 44.00,
      currentPrice: 44.00,
      image: "https://pub-7cf4fd2172224c91aca2d3399692e862.r2.dev/main-suspender-bowtie-set/powder-blue-model.png",
      href: "/collections/accessories/suspender-bowtie/powder-blue",
      discount: "-25%"
    }
  ],
  bundles: [
    {
      id: "bundle-1",
      brand: "KCT MENSWEAR",
      name: "COMPLETE PROM PACKAGE - BLAZER, SHIRT, ACCESSORIES",
      originalPrice: 699.00,
      salePrice: 499.00,
      currentPrice: 499.00,
      image: "https://pub-7cf4fd2172224c91aca2d3399692e862.r2.dev/blazers/prom/mens-gold-sequin-pattern-prom-blazer/front.webp",
      href: "/collections/prom/complete-packages/classic-prom",
      discount: "-29%"
    },
    {
      id: "bundle-2",
      brand: "KCT MENSWEAR",
      name: "FORMAL DINNER JACKET COMPLETE SET",
      currentPrice: 799.00,
      image: "https://pub-7cf4fd2172224c91aca2d3399692e862.r2.dev/blazers/velvet/mens-emerald-velvet-dinner-jacket/front.webp",
      href: "/collections/bundles/formal-complete",
      isNew: true
    },
    {
      id: "bundle-3",
      brand: "KCT MENSWEAR",
      name: "VEST & ACCESSORIES COMBO PACK",
      originalPrice: 149.00,
      salePrice: 119.00,
      currentPrice: 119.00,
      image: "https://pub-7cf4fd2172224c91aca2d3399692e862.r2.dev/main-solid-vest-tie/dusty-sage-model.png",
      href: "/collections/bundles/vest-accessories",
      discount: "-20%"
    }
  ]
};

export function TrendingNow() {
  const [activeTab, setActiveTab] = useState<"suits" | "shirts" | "accessories" | "bundles">("suits");
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const products = trendingProducts[activeTab];
  const itemsPerPage = 3;
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
                setActiveTab("suits");
                setCurrentIndex(0);
              }}
              className={`text-sm font-semibold tracking-wider transition-all pb-2 ${
                activeTab === "suits" 
                  ? "text-black border-b-2 border-black" 
                  : "text-gray-500 hover:text-black"
              }`}
            >
              SUITS
            </button>
            <button
              onClick={() => {
                setActiveTab("shirts");
                setCurrentIndex(0);
              }}
              className={`text-sm font-semibold tracking-wider transition-all pb-2 ${
                activeTab === "shirts" 
                  ? "text-black border-b-2 border-black" 
                  : "text-gray-500 hover:text-black"
              }`}
            >
              SHIRTS
            </button>
            <button
              onClick={() => {
                setActiveTab("accessories");
                setCurrentIndex(0);
              }}
              className={`text-sm font-semibold tracking-wider transition-all pb-2 ${
                activeTab === "accessories" 
                  ? "text-black border-b-2 border-black" 
                  : "text-gray-500 hover:text-black"
              }`}
            >
              ACCESSORIES
            </button>
            <button
              onClick={() => {
                setActiveTab("bundles");
                setCurrentIndex(0);
              }}
              className={`text-sm font-semibold tracking-wider transition-all pb-2 ${
                activeTab === "bundles" 
                  ? "text-black border-b-2 border-black" 
                  : "text-gray-500 hover:text-black"
              }`}
            >
              BUNDLES
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
                  className="min-w-[33.33%] px-4 group"
                >
                  <div className="relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                    {/* Discount Badge */}
                    {product.discount && (
                      <span className="absolute top-6 left-6 z-10 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded">
                        {product.discount}
                      </span>
                    )}
                    
                    {/* New Badge */}
                    {product.isNew && (
                      <span className="absolute top-6 left-6 z-10 bg-black text-white text-sm font-bold px-4 py-2 rounded">
                        NEW
                      </span>
                    )}

                    {/* Product Image - LARGE IMPRESSIVE SIZE */}
                    <div className="aspect-[4/5] bg-gray-100 mb-8 overflow-hidden rounded-t-lg" style={{ minHeight: '600px' }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-6">
                      {/* Brand */}
                      <p className="text-red-600 font-bold text-sm mb-4 tracking-wide">{product.brand}</p>

                      {/* Product Name */}
                      <h3 className="text-base font-semibold mb-6 line-clamp-3 min-h-[4.5rem] uppercase tracking-wide leading-relaxed">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center gap-4">
                        {product.originalPrice && (
                          <span className="text-gray-500 line-through text-xl">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className={`text-xl font-bold ${product.salePrice ? 'text-red-600' : 'text-black'}`}>
                          ${product.currentPrice.toFixed(2)}
                        </span>
                      </div>
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