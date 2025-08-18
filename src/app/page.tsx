"use client";

import { AIProductSections } from "@/components/home/AIProductSections";
import { MinimalFooterSection } from "@/components/home/MinimalFooterSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* AI-Powered Product Sections
          - Hero: Top 3 products with highest AI scores
          - Trending: Products with high trending scores
          - New Arrivals: Recently added products
          - Seasonal: Season-appropriate items
          - Bestsellers: Versatile essentials
          - Classics: Timeless pieces
      */}
      <AIProductSections />
      
      {/* Footer Section with Store Info */}
      <MinimalFooterSection />
    </main>
  );
}