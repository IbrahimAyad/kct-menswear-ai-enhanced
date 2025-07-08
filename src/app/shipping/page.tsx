import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Truck, Clock, Package, Shield, Star, MapPin } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-burgundy text-white py-16">
        <div className="container-main text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Shipping Information</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Fast, secure delivery to get your perfect fit when you need it
          </p>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-16">
        <div className="container-main">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Standard Shipping */}
            <Card className="p-6 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-serif text-center mb-2">Standard Shipping</h3>
              <div className="text-center mb-4">
                <span className="text-2xl font-bold text-green-600">FREE</span>
                <p className="text-sm text-gray-600">on orders $500+</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  5-7 business days
                </li>
                <li className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  Tracking included
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  Insurance up to $500
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-4">
                $9.99 for orders under $500
              </p>
            </Card>

            {/* Express Shipping */}
            <Card className="p-6 hover:shadow-xl transition-shadow border-2 border-burgundy/20">
              <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-burgundy" />
              </div>
              <h3 className="text-xl font-serif text-center mb-2">Express Shipping</h3>
              <div className="text-center mb-4">
                <span className="text-2xl font-bold text-burgundy">$19.99</span>
                <p className="text-sm text-gray-600">all orders</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  2-3 business days
                </li>
                <li className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  Priority tracking
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  Insurance up to $1,000
                </li>
              </ul>
              <div className="mt-4 text-center">
                <span className="inline-block bg-burgundy text-white px-2 py-1 rounded text-xs">
                  Most Popular
                </span>
              </div>
            </Card>

            {/* Rush Shipping */}
            <Card className="p-6 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-serif text-center mb-2">Rush Shipping</h3>
              <div className="text-center mb-4">
                <span className="text-2xl font-bold text-orange-600">$39.99</span>
                <p className="text-sm text-gray-600">next day available</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  1-2 business days
                </li>
                <li className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  Premium tracking
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  Full insurance
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-4">
                Order by 2PM EST for next day
              </p>
            </Card>
          </div>

          {/* Shipping Policies */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <h3 className="text-xl font-serif mb-4">Shipping Policies</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">Processing Time</h4>
                  <p className="text-gray-600">
                    Most orders ship within 1-2 business days. Custom alterations may require 
                    additional time (3-5 business days).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Shipping Locations</h4>
                  <p className="text-gray-600">
                    We currently ship to all 50 US states. International shipping available 
                    upon request with additional fees.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Package Tracking</h4>
                  <p className="text-gray-600">
                    All orders include tracking information sent to your email. Track your 
                    package 24/7 online.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Delivery Address</h4>
                  <p className="text-gray-600">
                    Please ensure your shipping address is accurate. We cannot be responsible 
                    for packages delivered to incorrect addresses.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-serif mb-4">Special Services</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">Local Delivery</h4>
                  <p className="text-gray-600">
                    <strong>FREE</strong> same-day delivery available within 25 miles of our 
                    stores. Orders placed by 2PM can be delivered same day.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Wedding Party Orders</h4>
                  <p className="text-gray-600">
                    Multiple shipping addresses available for wedding parties. Coordinate 
                    delivery dates to arrive before your event.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Rush Orders</h4>
                  <p className="text-gray-600">
                    Need it tomorrow? Call <strong>(269) 342-1234</strong> to check 
                    availability for next-day delivery.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">White Glove Service</h4>
                  <p className="text-gray-600">
                    Premium delivery service with unpacking, setup, and consultation available 
                    for orders over $1,000.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Shipping Calculator */}
          <Card className="p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif mb-6 text-center">Shipping Calculator</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">ZIP Code</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-burgundy"
                  placeholder="49007"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Order Total</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-burgundy"
                  placeholder="500.00"
                />
              </div>
            </div>
            <Button className="w-full bg-burgundy hover:bg-burgundy/90">
              Calculate Shipping
            </Button>
          </Card>

          {/* FAQ */}
          <Card className="p-8 mt-12">
            <h3 className="text-2xl font-serif mb-6 text-center">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">When will my order ship?</h4>
                  <p className="text-sm text-gray-600">
                    Most orders ship within 1-2 business days. You'll receive tracking information 
                    once your order ships.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I change my shipping address?</h4>
                  <p className="text-sm text-gray-600">
                    Yes, if your order hasn't shipped yet. Contact us immediately at 
                    (269) 342-1234 to make changes.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What if I'm not home for delivery?</h4>
                  <p className="text-sm text-gray-600">
                    The carrier will leave a delivery notice and attempt redelivery. 
                    You can also arrange pickup at their local facility.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Do you ship internationally?</h4>
                  <p className="text-sm text-gray-600">
                    We offer international shipping to select countries. Contact us for 
                    rates and availability.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How is my package protected?</h4>
                  <p className="text-sm text-gray-600">
                    All packages are insured and require signature confirmation for 
                    orders over $200.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I expedite my order?</h4>
                  <p className="text-sm text-gray-600">
                    Yes! Call us at (269) 342-1234 to upgrade to express or rush shipping 
                    if your order hasn't shipped.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}