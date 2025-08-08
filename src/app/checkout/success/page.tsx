'use client'

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { trackPurchase } from '@/lib/analytics/google-analytics';
import { useCart } from '@/lib/hooks/useCart';

export default function CheckoutSuccess({ 
  searchParams 
}: { 
  searchParams: Promise<{ session_id?: string }> 
}) {
  const { clearCart } = useCart();

  useEffect(() => {
    const processSuccess = async () => {
      const params = await searchParams;
      // Track purchase completion
      if (params.session_id) {
        // In a real implementation, you would fetch order details from your API
        // For now, we'll use the session ID as transaction ID
        trackPurchase({
          transaction_id: params.session_id,
        value: 0, // This would come from the actual order
        currency: 'USD',
        items: [], // This would come from the actual order items
      });

        // Clear the cart after successful purchase
        clearCart();
      }
    };
    
    processSuccess();
  }, [searchParams, clearCart]);
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. You'll receive an email confirmation shortly with your order details.
        </p>
        
        {searchParams.session_id && (
          <p className="text-sm text-gray-500 mb-6">
            Order ID: {searchParams.session_id.slice(0, 20)}...
          </p>
        )}
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-md p-4">
            <h2 className="font-semibold mb-2">What's Next?</h2>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>• You'll receive an order confirmation email</li>
              <li>• We'll process your order within 24 hours</li>
              <li>• Shipping typically takes 5-7 business days</li>
              <li>• Track your order status via the email link</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 rounded-md p-4">
            <p className="text-sm text-blue-800">
              <strong>Need help?</strong> Contact us at support@kctmenswear.com or call (555) 123-4567
            </p>
          </div>
        </div>
        
        <div className="mt-8 space-x-4">
          <Link
            href="/"
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}