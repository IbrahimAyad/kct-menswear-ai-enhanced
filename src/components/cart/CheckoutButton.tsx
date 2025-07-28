'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '@/lib/hooks/useCart';
import { useProductStore } from '@/lib/store/productStore';
import { stripeProducts } from '@/lib/services/stripeProductService';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function CheckoutButton() {
  const { items, cartSummary } = useCart();
  const { products } = useProductStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Helper function to get Stripe price ID for a product
  const getStripePriceId = (product: any) => {
    // First check if product has metadata with stripePriceId
    if (product.metadata?.stripePriceId) {
      return product.metadata.stripePriceId;
    }
    
    // Check if it's a suit
    const category = product.category?.toLowerCase();
    
    if (category === 'suits') {
      // Find the color in our stripe products mapping
      const colorKey = product.metadata?.suitColor || 
        Object.keys(stripeProducts.suits).find(key => 
          product.name.toLowerCase().includes(key.toLowerCase().replace(/([A-Z])/g, ' $1').trim())
        );
      
      if (colorKey) {
        const suitData = stripeProducts.suits[colorKey as keyof typeof stripeProducts.suits];
        // Check if it's 2-piece or 3-piece
        const is3Piece = product.name.includes('3 Piece') || product.metadata?.suitType === 'threePiece';
        return is3Piece ? suitData.threePiece : suitData.twoPiece;
      }
    }
    
    // For other products, you would add similar mappings
    // For now, return null if we can't find a mapping
    return null;
  };
  
  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare cart items for checkout
      const checkoutItems = items.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        
        const stripePriceId = getStripePriceId(product);
        if (!stripePriceId) {
          throw new Error(`No Stripe price found for ${product.name}`);
        }
        
        return {
          stripePriceId,
          quantity: item.quantity,
          name: product.name,
          selectedSize: item.size,
          selectedColor: product.color || 'default',
          id: product.id,
          price: product.price,
        };
      });
      
      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: checkoutItems,
          customerEmail: '', // Optional: collect email before checkout
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Checkout failed');
      }
      
      const { sessionId, url } = await response.json();
      
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else if (sessionId) {
        // Fallback to Stripe.js redirect
        const stripe = await stripePromise;
        if (!stripe) throw new Error('Stripe failed to load');
        
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) throw error;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-2">
      <button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="w-full bg-black text-white py-4 px-6 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          `Checkout - $${cartSummary.totalPrice.toFixed(2)}`
        )}
      </button>
      
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
      
      <p className="text-xs text-gray-500 text-center">
        Secure checkout powered by Stripe
      </p>
    </div>
  );
}