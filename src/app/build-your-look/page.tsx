"use client";

import { BuildYourLookModern } from "@/components/home/BuildYourLookModern";

// Premium outfit combinations for Build Your Look
const outfitCombinations = [
  {
    id: "executive",
    name: "Executive Power",
    suit: {
      id: "navy-suit",
      name: "Navy Tailored Suit",
      price: 189,
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80"
    },
    shirt: {
      id: "white-shirt",
      name: "Crisp White Shirt",
      price: 49,
      image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80"
    },
    tie: {
      id: "burgundy-tie",
      name: "Burgundy Silk Tie",
      price: 29,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"
    },
    totalPrice: 267,
    bundlePrice: 229,
    savings: 38,
    description: "Commanding presence for the modern executive"
  },
  {
    id: "wedding",
    name: "Wedding Classic",
    suit: {
      id: "charcoal-suit",
      name: "Charcoal Three-Piece",
      price: 229,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
    },
    shirt: {
      id: "light-blue-shirt",
      name: "Light Blue Shirt",
      price: 55,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80"
    },
    tie: {
      id: "silver-tie",
      name: "Silver Tie",
      price: 35,
      image: "https://images.unsplash.com/photo-1592878849122-facb97520f9e?w=800&q=80"
    },
    totalPrice: 319,
    bundlePrice: 279,
    savings: 40,
    description: "Timeless elegance for your special day"
  },
  {
    id: "black-tie",
    name: "Black Tie Elite",
    suit: {
      id: "black-tuxedo",
      name: "Black Tuxedo",
      price: 279,
      image: "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?w=800&q=80"
    },
    shirt: {
      id: "formal-white",
      name: "Formal White Shirt",
      price: 65,
      image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80"
    },
    tie: {
      id: "black-bowtie",
      name: "Black Bow Tie",
      price: 25,
      image: "https://images.unsplash.com/photo-1558040351-6f8e75792509?w=800&q=80"
    },
    totalPrice: 369,
    bundlePrice: 329,
    savings: 40,
    description: "Sophisticated luxury for formal events"
  }
];

export default function BuildYourLookPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Build Your Look</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create the perfect ensemble with our interactive styling tool. Mix and
            match premium pieces to discover your signature style.
          </p>
        </div>
        
        <BuildYourLookModern outfits={outfitCombinations} />
      </div>
    </div>
  );
}