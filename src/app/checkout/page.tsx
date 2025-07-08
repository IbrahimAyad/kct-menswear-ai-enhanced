"use client";

import { useState } from "react";
import { useCart } from "@/lib/hooks/useCart";
import { useProductStore } from "@/lib/store/productStore";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowLeft, CreditCard, Truck, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function CheckoutPage() {
  const { items, cartSummary } = useCart();
  const { products } = useProductStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const cartItemsWithProducts = items.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // In production, this would create a checkout session with your backend
      const stripe = await stripePromise;
      
      // Simulate processing
      setTimeout(() => {
        alert("Demo checkout - In production this would process with Stripe");
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error("Checkout error:", error);
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const shipping = cartSummary.totalPrice >= 50000 ? 0 : 1500;
  const total = cartSummary.totalPrice + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gold/20 shadow-sm">
        <div className="container-main py-6">
          <div className="flex items-center justify-between">
            <Link href="/cart" className="inline-flex items-center gap-2 text-gray-600 hover:text-gold transition-colors group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Cart
            </Link>
            <div className="flex items-center gap-2 text-green-600">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-main py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-gold mb-4">
            <div className="h-px w-12 bg-gold"></div>
            <span className="text-sm font-semibold tracking-widest uppercase">Secure Payment</span>
            <div className="h-px w-12 bg-gold"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Complete Your Order</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            You're just a few steps away from receiving your premium menswear
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-black font-bold text-sm">
                    1
                  </div>
                  <h2 className="text-xl font-serif font-semibold">Contact Information</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 bg-white shadow-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 bg-white shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-black font-bold text-sm">
                    2
                  </div>
                  <h2 className="text-xl font-serif font-semibold">Shipping Address</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 bg-white shadow-sm"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 bg-white shadow-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 bg-white shadow-sm"
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-black font-bold text-sm">
                    3
                  </div>
                  <h2 className="text-xl font-serif font-semibold">Payment Method</h2>
                </div>
                <div className="border-2 border-dashed border-gold/30 rounded-sm p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-gray-700 font-medium mb-2">
                    Secure payment powered by Stripe
                  </p>
                  <p className="text-sm text-gray-600">
                    Your payment information is encrypted and secure
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <span className="text-xs text-gray-500">SSL Encrypted</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-500">PCI Compliant</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-500">256-bit Security</span>
                  </div>
                </div>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-8 border-0 shadow-xl sticky top-24 bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">✓</span>
                </div>
                <h2 className="text-xl font-serif font-semibold">Order Summary</h2>
              </div>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItemsWithProducts.map((item) => {
                  if (!item.product) return null;
                  
                  return (
                    <div key={`${item.productId}-${item.size}`} className="flex gap-4 p-3 bg-white rounded-sm border border-gray-100 hover:border-gold/30 transition-colors">
                      <div className="relative w-16 h-20 bg-gray-100 rounded-sm overflow-hidden shadow-sm">
                        {item.product.images[0] && (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Size {item.size} • Qty {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4 border-t border-gold/20 pt-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(cartSummary.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? "text-green-600" : ""}`}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                {shipping === 0 && (
                  <div className="text-xs text-green-600 text-right">
                    You saved {formatPrice(1500)}!
                  </div>
                )}
                <div className="flex justify-between text-2xl font-bold border-t border-gold/20 pt-4">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full mt-8 bg-gold hover:bg-gold/90 text-black py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={handleSubmit}
                disabled={isProcessing}
              >
                <div className="flex items-center justify-center gap-2">
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5" />
                      Complete Secure Order
                    </>
                  )}
                </div>
              </Button>

              {/* Trust Badges */}
              <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-sm border border-green-200">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-green-800 font-medium">SSL Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Truck className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-green-800 font-medium">Free shipping on orders over $500</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-green-800 font-medium">30-day return guarantee</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}