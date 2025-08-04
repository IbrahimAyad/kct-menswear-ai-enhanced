"use client";

import { useCart } from "@/lib/hooks/useCart";
import { useProductStore } from "@/lib/store/productStore";
import { formatPrice, getSizeLabel } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, User, Lock, Clock, Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutBenefits } from "@/components/checkout/CheckoutBenefits";
import { useCartPersistence } from "@/hooks/useCartPersistence";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function CartPage() {
  const { items, cartSummary, updateQuantity, removeFromCart, isLoading } = useCart();
  const { products } = useProductStore();
  const { user } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [showGuestCheckout, setShowGuestCheckout] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [savedForLater] = useState<any[]>([]);
  
  // Enable cart persistence
  useCartPersistence();

  // Validate email
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(guestEmail));
  }, [guestEmail]);

  const cartItemsWithProducts = items.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  }));

  const validCartItems = cartItemsWithProducts.filter(item => item.product);

  const handleCheckout = async () => {
    setIsProcessingCheckout(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items,
          customerEmail: user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const { sessionId, url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        const stripe = await stripePromise;
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) {
            console.error('Stripe redirect error:', error);
            alert('Unable to redirect to checkout. Please try again.');
          }
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const handleGuestCheckout = async () => {
    if (!guestEmail) return;
    
    setIsProcessingCheckout(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items,
          customerEmail: guestEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const { sessionId, url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        const stripe = await stripePromise;
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) {
            console.error('Stripe redirect error:', error);
            alert('Unable to redirect to checkout. Please try again.');
          }
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="h-12 w-12 text-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-6">Your Cart is Empty</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Discover our premium collection of expertly crafted menswear
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-gold hover:bg-gold/90 text-black px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container-main py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-gold mb-4">
            <div className="h-px w-12 bg-gold"></div>
            <span className="text-sm font-semibold tracking-widest uppercase">Your Selection</span>
            <div className="h-px w-12 bg-gold"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Shopping Cart</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Review your carefully selected items before proceeding to checkout
          </p>
        </div>

        {/* Benefits Bar */}
        <CheckoutBenefits />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {validCartItems.map((item) => {
              if (!item.product) return null;
              
              const variant = item.product.variants.find(v => v.size === item.size);
              const maxStock = variant?.stock || 0;

              return (
                <Card key={`${item.productId}-${item.size}`} className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative group">
                  {/* Low Stock Badge */}
                  {variant && variant.stock <= 3 && variant.stock > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Only {variant.stock} left!
                    </div>
                  )}
                  <div className="flex gap-6">
                    <div className="relative w-32 h-40 bg-gray-100 rounded-sm overflow-hidden shadow-md">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <div>
                          <Link 
                            href={`/products/${item.product.id}`}
                            className="text-xl font-serif font-semibold hover:text-gold transition-colors duration-200"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-gray-600 mt-2">
                            Size: {getSizeLabel(item.size)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            SKU: {item.product.sku}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-sm transition-colors duration-200"
                          disabled={isLoading}
                          title="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))}
                            className="h-10 w-10 border border-gold/30 rounded-sm hover:bg-gold/10 hover:border-gold disabled:opacity-50 flex items-center justify-center transition-all duration-200"
                            disabled={item.quantity <= 1 || isLoading}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, Math.min(maxStock, item.quantity + 1))}
                            className="h-10 w-10 border border-gold/30 rounded-sm hover:bg-gold/10 hover:border-gold disabled:opacity-50 flex items-center justify-center transition-all duration-200"
                            disabled={item.quantity >= maxStock || isLoading}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          {maxStock <= 5 && (
                            <span className="text-sm text-red-500">
                              Only {maxStock} left
                            </span>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-gold">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-500 mt-1">
                              {formatPrice(item.product.price)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-8 border-0 shadow-xl sticky top-24 bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">✓</span>
                </div>
                <h2 className="text-xl font-serif font-semibold">Order Summary</h2>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Subtotal ({cartSummary.itemCount} items)</span>
                  <span className="font-semibold">{formatPrice(cartSummary.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Shipping</span>
                  <span className={`font-semibold ${cartSummary.totalPrice >= 50000 ? 'text-green-600' : ''}`}>
                    {cartSummary.totalPrice >= 50000 ? "FREE" : formatPrice(1500)}
                  </span>
                </div>
                {cartSummary.totalPrice < 50000 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
                    <p className="text-sm text-blue-800 font-medium">
                      Add {formatPrice(50000 - cartSummary.totalPrice)} more for free shipping!
                    </p>
                  </div>
                )}
              </div>

              {/* Promo Code */}
              <div className="mb-8">
                <label className="text-sm font-semibold mb-3 block text-gray-700">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter discount code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200"
                  />
                  <Button variant="outline" className="px-4 py-3 border-gold/30 hover:border-gold hover:bg-gold/10 transition-all duration-200">
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Estimated Total */}
              <div className="border-2 border-gold/30 rounded-sm p-4 mb-6 bg-gold/5">
                <div className="flex justify-between text-xl font-bold">
                  <span>Estimated Total</span>
                  <span className="text-gold">
                    {formatPrice(cartSummary.totalPrice + (cartSummary.totalPrice >= 50000 ? 0 : 1500))}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  <Lock className="inline w-3 h-3 mr-1" />
                  Final total calculated at checkout with taxes
                </p>
              </div>

              <div className="border-t border-gold/20 pt-6 mb-8">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-gold">
                    {formatPrice(
                      cartSummary.totalPrice + 
                      (cartSummary.totalPrice < 50000 ? 1500 : 0)
                    )}
                  </span>
                </div>
              </div>

              {/* Checkout Options */}
              {!user && !showGuestCheckout ? (
                <div className="space-y-3">
                  <Link href="/auth/login?redirectTo=/checkout">
                    <Button size="lg" className="w-full bg-gold hover:bg-gold/90 text-black py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                      <User className="mr-2 h-5 w-5" />
                      Sign In & Checkout
                    </Button>
                  </Link>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setShowGuestCheckout(true)}
                    className="w-full py-4 border-gold/30 hover:border-gold hover:bg-gold/10 transition-all duration-300"
                  >
                    Continue as Guest
                  </Button>
                </div>
              ) : showGuestCheckout && !user ? (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 transition-all ${
                        guestEmail && !isEmailValid 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-gold focus:border-gold'
                      }`}
                      required
                    />
                    {guestEmail && !isEmailValid && (
                      <p className="text-xs text-red-500 mt-1">Please enter a valid email address</p>
                    )}
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full bg-gold hover:bg-gold/90 text-black py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    onClick={handleGuestCheckout}
                    disabled={!isEmailValid || isProcessingCheckout}
                  >
                    {isProcessingCheckout ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                  <button
                    onClick={() => setShowGuestCheckout(false)}
                    className="text-sm text-gray-600 hover:text-black w-full text-center"
                  >
                    Back to options
                  </button>
                </div>
              ) : (
                <Button 
                  size="lg" 
                  className="w-full mb-4 bg-gold hover:bg-gold/90 text-black py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  onClick={handleCheckout}
                  disabled={isProcessingCheckout}
                >
                  {isProcessingCheckout ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              )}

              <Link href="/products">
                <Button variant="outline" size="lg" className="w-full py-4 border-gold/30 hover:border-gold hover:bg-gold/10 transition-all duration-300">
                  Continue Shopping
                </Button>
              </Link>

              <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-sm border border-green-200">
                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-green-800 font-medium">Free shipping on orders over $500</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-green-800 font-medium">Free returns within 30 days</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-green-800 font-medium">Expert tailoring available</span>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}