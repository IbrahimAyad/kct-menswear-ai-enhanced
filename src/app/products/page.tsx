"use client";

import { useState, useMemo } from "react";
import { useProducts, useProductsByCategory } from "@/lib/hooks/useProducts";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProductCategory } from "@/lib/types";

const categories: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "suits", label: "Suits" },
  { value: "shirts", label: "Shirts" },
  { value: "accessories", label: "Accessories" },
  { value: "shoes", label: "Shoes" },
];

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  
  // Use the appropriate hook based on category selection
  const allProductsData = useProducts();
  const categoryProductsData = useProductsByCategory(selectedCategory);
  
  const { products, isLoading, error } = 
    selectedCategory === "all" ? allProductsData : categoryProductsData;

  // Sort products based on selection
  const sortedProducts = useMemo(() => {
    if (!products) return [];
    
    const sorted = [...products];
    
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // Assuming newer products have higher IDs
        sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case "featured":
      default:
        // Keep original order or use featured logic
        break;
    }
    
    return sorted;
  }, [products, sortBy]);

  // Filter products by category if "all" is selected
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return sortedProducts;
    }
    return sortedProducts.filter(p => p.category === selectedCategory);
  }, [sortedProducts, selectedCategory]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="container-main relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-gold mb-4">
              <div className="h-px w-12 bg-gold"></div>
              <span className="text-sm font-semibold tracking-widest uppercase">Premium Collection</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">Our Collection</h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Premium suits, shirts, and accessories meticulously crafted for the modern gentleman
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-gold/10 sticky top-16 bg-white/95 backdrop-blur-sm z-30 shadow-sm">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.value)}
                  disabled={isLoading}
                  className={selectedCategory === category.value 
                    ? "bg-gold hover:bg-gold/90 text-black border-gold shadow-md" 
                    : "border-gold/30 hover:border-gold hover:bg-gold/10 transition-all duration-200"
                  }
                >
                  {category.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select 
                className="border border-gold/30 rounded px-4 py-2 text-sm bg-white hover:border-gold focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                disabled={isLoading}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Error loading products</p>
              <Button onClick={() => allProductsData.refetch()}>
                Try Again
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gold mb-4" />
              <p className="text-gray-600">Loading collection...</p>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </section>
    </div>
  );
}