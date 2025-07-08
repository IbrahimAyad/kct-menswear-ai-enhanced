import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Package, Shield, Clock, CheckCircle, XCircle } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-burgundy text-white py-16">
        <div className="container-main text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Returns & Exchanges</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Your satisfaction is our priority. Easy returns and exchanges guaranteed.
          </p>
        </div>
      </section>

      {/* Return Policy Overview */}
      <section className="py-16">
        <div className="container-main">
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">30-Day Returns</h3>
              <p className="text-sm text-gray-600">Full refund or exchange within 30 days</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Free Returns</h3>
              <p className="text-sm text-gray-600">No cost return shipping on all orders</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Easy Exchanges</h3>
              <p className="text-sm text-gray-600">Quick size or style exchanges</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-sm text-gray-600">We stand behind every product</p>
            </Card>
          </div>

          {/* Return Process */}
          <Card className="p-8 mb-12">
            <h2 className="text-2xl font-serif mb-6 text-center">How to Return an Item</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-burgundy text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Start Your Return</h3>
                <p className="text-sm text-gray-600">
                  Visit our return portal online or call (269) 342-1234 to initiate your return.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-burgundy text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Pack & Ship</h3>
                <p className="text-sm text-gray-600">
                  Use our prepaid return label to ship your item back to us in original packaging.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-burgundy text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Get Your Refund</h3>
                <p className="text-sm text-gray-600">
                  Receive your refund within 3-5 business days of us receiving your return.
                </p>
              </div>
            </div>
          </Card>

          {/* Return Conditions */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <h3 className="text-xl font-serif mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Items We Accept
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Items in original condition with tags attached
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Unworn suits, shirts, and accessories
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Items returned within 30 days of purchase
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Items in original packaging
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Defective or damaged items (any time)
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-serif mb-4 flex items-center gap-2">
                <XCircle className="w-6 h-6 text-red-600" />
                Items We Cannot Accept
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  Custom altered or tailored items
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  Worn, washed, or damaged items
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  Items without original tags or packaging
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  Items returned after 30 days (unless defective)
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  Personal care items (ties with stains, etc.)
                </li>
              </ul>
            </Card>
          </div>

          {/* Return Form */}
          <Card className="p-8 max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-serif mb-6 text-center">Start Your Return</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Order Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-burgundy"
                  placeholder="KCT-2024-001234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-burgundy"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Reason for Return</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-burgundy">
                  <option>Size too small</option>
                  <option>Size too large</option>
                  <option>Color not as expected</option>
                  <option>Quality issue</option>
                  <option>Changed mind</option>
                  <option>Defective item</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Which item(s) would you like to return?</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-burgundy"
                  placeholder="Please list the items you'd like to return..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Additional Comments (Optional)</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-burgundy"
                  placeholder="Any additional details..."
                />
              </div>

              <div className="flex gap-4">
                <Button className="flex-1 bg-burgundy hover:bg-burgundy/90">
                  Request Return Label
                </Button>
                <Button variant="outline" className="flex-1">
                  Exchange Instead
                </Button>
              </div>
            </form>
          </Card>

          {/* FAQ */}
          <Card className="p-8">
            <h3 className="text-2xl font-serif mb-6 text-center">Return FAQ</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How long do I have to return an item?</h4>
                  <p className="text-sm text-gray-600">
                    You have 30 days from the date of purchase to return any item in its original condition.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What if I lost my receipt?</h4>
                  <p className="text-sm text-gray-600">
                    No problem! We can look up your order using your email address or phone number.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I return altered items?</h4>
                  <p className="text-sm text-gray-600">
                    Unfortunately, we cannot accept returns on items that have been altered or tailored.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How long does a refund take?</h4>
                  <p className="text-sm text-gray-600">
                    Refunds are processed within 3-5 business days after we receive your return.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Can I exchange for a different size?</h4>
                  <p className="text-sm text-gray-600">
                    Yes! Size exchanges are free and easy. Just let us know your preferred size when starting your return.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What if my item arrives damaged?</h4>
                  <p className="text-sm text-gray-600">
                    Contact us immediately at (269) 342-1234. We'll arrange for a replacement or full refund.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Do I need to pay for return shipping?</h4>
                  <p className="text-sm text-gray-600">
                    No! We provide free return shipping labels for all returns and exchanges.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I return items bought in-store?</h4>
                  <p className="text-sm text-gray-600">
                    Yes, you can return in-store purchases either online or at either of our locations.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Section */}
          <Card className="p-8 mt-12 text-center">
            <h3 className="text-2xl font-serif mb-4">Need Help with Your Return?</h3>
            <p className="text-gray-600 mb-6">
              Our customer service team is here to help make your return experience as smooth as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="gap-2">
                <Package className="w-4 h-4" />
                Call (269) 342-1234
              </Button>
              <Button className="bg-burgundy hover:bg-burgundy/90 gap-2">
                <RefreshCw className="w-4 h-4" />
                Start Return Online
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}