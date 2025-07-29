'use client';

import { useState } from 'react';
import { useCart } from '@/lib/hooks/useCart';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { CheckoutButton } from './CheckoutButton';

export function SimpleCartDrawer() {
  const { items, cartSummary, removeFromCart, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      {/* Cart Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-black text-white p-3 rounded-full shadow-lg z-50"
      >
        <ShoppingCart size={20} />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
          {items.length}
        </span>
      </button>

      {/* Cart Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Shopping Cart ({items.length})</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name || `Product ${item.productId}`}</h3>
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold">${item.price || 0}</p>
                      
                      {/* Debug info */}
                      <div className="text-xs text-gray-400 mt-1">
                        {item.metadata?.stripePriceId ? (
                          <span className="text-green-600">✓ Ready for checkout</span>
                        ) : (
                          <span className="text-red-600">✗ Missing checkout data</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId, item.size)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total: ${cartSummary.totalPrice.toFixed(2)}</span>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Clear All
                </button>
              </div>
              
              <CheckoutButton />
              
              <p className="text-xs text-gray-500 text-center">
                If checkout fails, try clearing cart and adding items again
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}