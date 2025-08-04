'use client'

import { useState } from 'react'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function WishlistPage() {
  // Start with empty wishlist - this would be populated from database/API in production
  const [wishlistItems, setWishlistItems] = useState<any[]>([])

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(items => items.filter(item => item.id !== itemId))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8">Save items you love to view them later</p>
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-1">{wishlistItems.length} items saved</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
              <div className="relative aspect-square">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-medium">Out of Stock</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-xl font-bold text-black mb-3">{formatPrice(item.price)}</p>
                
                <div className="flex gap-2">
                  <Link
                    href={`/products/${item.id}`}
                    className="flex-1 text-center py-2 px-4 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
                  >
                    View Details
                  </Link>
                  <button
                    disabled={!item.inStock}
                    className="flex-1 py-2 px-4 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                  >
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Added {new Date(item.addedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}