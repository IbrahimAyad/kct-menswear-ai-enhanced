"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useProduct } from "@/lib/hooks/useProducts";
import { useCart } from "@/lib/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice, getSizeLabel } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { 
  ArrowLeft, Check, Loader2, ShoppingBag, Truck, Shield, Ruler, 
  Star, Heart, Share2, Eye, Clock, Users, Award, Zap, 
  MessageCircle, ThumbsUp, Camera, Bot, Sparkles, TrendingUp, Calendar
} from "lucide-react";
import Link from "next/link";
import { FashionClipRecommendations } from "@/components/recommendations/FashionClipRecommendations";
import { Badge } from "@/components/ui/badge";
import { SizeBot } from "@/components/products/SizeBot";
import { AnimatePresence } from "framer-motion";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addSuccess, setAddSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showSizeBot, setShowSizeBot] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [viewCount, setViewCount] = useState(Math.floor(Math.random() * 100) + 50);
  const [recentPurchases] = useState(Math.floor(Math.random() * 20) + 5);

  const { product, isLoading, error: loadError } = useProduct(productId);
  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (loadError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Product not found</p>
        <Button onClick={() => router.push("/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  const selectedVariant = product.variants.find(v => v.size === selectedSize);
  const maxQuantity = selectedVariant?.stock || 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }

    try {
      addToCart(product, selectedSize, quantity);
      setAddSuccess(true);
      setError("");
      setTimeout(() => {
        setAddSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-black">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-600 hover:text-black">
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-black">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-main">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-[3/4] relative bg-gray-100 rounded-sm overflow-hidden">
                {product.images[selectedImage] ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ShoppingBag className="h-24 w-24" />
                  </div>
                )}
              </div>
              
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "aspect-square relative bg-gray-100 rounded-sm overflow-hidden border-2 transition-colors",
                        selectedImage === index ? "border-gold" : "border-transparent"
                      )}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                {/* Trust Signals */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">(127 reviews)</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Bestseller</Badge>
                  <Badge className="bg-blue-100 text-blue-800">AI Recommended</Badge>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-serif mb-2">{product.name}</h1>
                
                {/* Social Proof */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{viewCount} people viewing</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShoppingBag className="w-4 h-4" />
                    <span>{recentPurchases} sold this week</span>
                  </div>
                </div>
                
                <p className="text-gray-600">SKU: {product.sku}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold">{formatPrice(product.price)}</div>
                  <div className="text-lg text-gray-500 line-through">{formatPrice(product.price * 1.2)}</div>
                  <Badge className="bg-red-100 text-red-800">20% OFF</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span className="text-red-500 font-medium">Sale ends in 2 days, 14 hours</span>
                </div>
                <p className="text-sm text-gray-600">4 interest-free payments of {formatPrice(product.price / 4)} with Klarna</p>
              </div>

              {/* Size Selection with Bot Integration */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    Select Size
                    <button 
                      onClick={() => setShowSizeBot(true)}
                      className="text-gold hover:underline text-sm font-normal flex items-center gap-1 bg-gold/10 px-2 py-1 rounded-full"
                    >
                      <Bot className="h-3 w-3" />
                      AI Size Bot
                    </button>
                  </h3>
                  <button className="text-gold hover:underline text-sm flex items-center gap-1">
                    <Ruler className="h-3 w-3" />
                    Size Guide
                  </button>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.size}
                      onClick={() => variant.stock > 0 && setSelectedSize(variant.size)}
                      disabled={variant.stock === 0}
                      className={cn(
                        "py-3 px-4 border rounded-sm transition-all text-sm font-medium",
                        variant.stock === 0 && "opacity-50 cursor-not-allowed bg-gray-50",
                        selectedSize === variant.size
                          ? "border-gold bg-gold text-black"
                          : "border-gray-300 hover:border-gray-400"
                      )}
                    >
                      <div>{variant.size}</div>
                      {variant.stock <= 3 && variant.stock > 0 && (
                        <div className="text-xs text-red-500 mt-1">
                          {variant.stock} left
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <p className="text-sm text-gray-600 mt-2">
                    {getSizeLabel(selectedSize)}
                  </p>
                )}
              </div>

              {/* Quantity */}
              {selectedSize && (
                <div>
                  <h3 className="font-semibold mb-3">Quantity</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 border rounded-sm hover:bg-gray-50"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setQuantity(Math.min(maxQuantity, Math.max(1, val)));
                      }}
                      className="h-10 w-20 text-center border rounded-sm"
                      min="1"
                      max={maxQuantity}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      className="h-10 w-10 border rounded-sm hover:bg-gray-50"
                      disabled={quantity >= maxQuantity}
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-600 ml-2">
                      {maxQuantity} available
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              {/* Add to Cart & Actions */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1 bg-gold hover:bg-gold/90 text-black font-semibold"
                    onClick={handleAddToCart}
                    disabled={!selectedSize || addSuccess}
                  >
                    {addSuccess ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Cart - {formatPrice(product.price * quantity)}
                      </>
                    )}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={isWishlisted ? 'border-red-300 text-red-600' : ''}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </Button>
                  <Button size="lg" variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button size="lg" variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Fitting
                  </Button>
                  <Button size="lg" variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Style Consultation
                  </Button>
                </div>
                
                {/* Urgency Elements */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-orange-800">
                    <Zap className="w-4 h-4" />
                    <span className="font-medium">Limited Time Offer</span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Only 3 left in your size. Order within 2 hours for same-day tailoring.
                  </p>
                </div>
              </div>

              {/* Trust & Value Props */}
              <div className="space-y-4 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-gold mt-0.5" />
                    <div>
                      <p className="font-semibold">Free Shipping</p>
                      <p className="text-sm text-gray-600">On orders over $500</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-gold mt-0.5" />
                    <div>
                      <p className="font-semibold">Quality Guarantee</p>
                      <p className="text-sm text-gray-600">Premium materials & expert tailoring</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-gold mt-0.5" />
                    <div>
                      <p className="font-semibold">Expert Tailoring</p>
                      <p className="text-sm text-gray-600">30+ years of experience</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-gold mt-0.5" />
                    <div>
                      <p className="font-semibold">Customer Loved</p>
                      <p className="text-sm text-gray-600">4.9/5 stars from 2,000+ reviews</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Knowledge Bank Recommendations */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold" />
                  Complete the Look
                </h3>
                <div className="bg-gold/5 border border-gold/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Our AI stylist analyzed 10,000+ outfit combinations to suggest these perfect matches:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="text-sm font-medium">Recommended Shirt</div>
                      <div className="text-xs text-gray-600">White Egyptian Cotton</div>
                      <div className="text-sm font-bold text-gold">+$89</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="text-sm font-medium">Perfect Tie</div>
                      <div className="text-xs text-gray-600">Silk Navy Paisley</div>
                      <div className="text-sm font-bold text-gold">+$45</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="text-sm font-medium">Dress Shoes</div>
                      <div className="text-xs text-gray-600">Oxford Leather</div>
                      <div className="text-sm font-bold text-gold">+$159</div>
                    </div>
                  </div>
                  <Button className="w-full mt-3 bg-gold hover:bg-gold/90 text-black">
                    Add Complete Look - Save 15%
                  </Button>
                </div>
              </div>
              
              {/* Description */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="font-semibold text-lg">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  Elevate your formal wardrobe with our {product.name}. Crafted from premium materials
                  and tailored to perfection, this piece combines classic style with modern sophistication.
                  Perfect for business meetings, special occasions, or any event where you want to make
                  a lasting impression.
                </p>
                
                {/* Fabric & Care */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h4 className="font-medium mb-2">Fabric Details</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 100% Super 120s Wool</li>
                      <li>• Wrinkle-resistant finish</li>
                      <li>• Half-canvas construction</li>
                      <li>• Horn buttons</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Care Instructions</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Dry clean only</li>
                      <li>• Steam to refresh</li>
                      <li>• Hang on padded hangers</li>
                      <li>• Professional pressing recommended</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews & Social Proof */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-xl font-semibold">4.9</span>
              <span className="text-gray-600">(2,127 reviews)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { name: "Michael Chen", review: "Perfect fit and incredible quality. The AI size bot was spot-on with recommendations!", rating: 5, verified: true },
              { name: "James Wilson", review: "Best suit I've ever owned. The complete look suggestions saved me hours of shopping.", rating: 5, verified: true },
              { name: "Robert Taylor", review: "Exceptional craftsmanship. Received countless compliments at my wedding.", rating: 5, verified: true }
            ].map((review, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{review.review}"</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{review.name}</span>
                  {review.verified && (
                    <Badge className="bg-green-100 text-green-800 text-xs">Verified Purchase</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button variant="outline" size="lg">
              Read All 2,127 Reviews
            </Button>
          </div>
        </div>
      </section>

      {/* Fashion CLIP Visual Search */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">Find Similar Styles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI analyzes visual patterns, colors, and style elements to find items that match your taste
            </p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <FashionClipRecommendations 
                currentProduct={product}
                className="h-fit"
              />
            </div>
            
            {/* AI Insights */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-serif mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-gold" />
                  Visual Search
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Upload a photo or screenshot to find similar styles instantly.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Camera className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-serif mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gold" />
                  Trending Now
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Navy Suits</span>
                    <Badge className="bg-green-100 text-green-800">+23%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Wedding Season</span>
                    <Badge className="bg-blue-100 text-blue-800">Peak</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Business Formal</span>
                    <Badge className="bg-purple-100 text-purple-800">Hot</Badge>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-serif mb-4">Recently Viewed</h3>
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Your browsing history helps our AI recommend better matches.
                  </p>
                  <Button variant="outline" className="w-full">
                    View All History
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Bundles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">Smart Bundles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our Knowledge Bank analyzed thousands of outfit combinations to create these perfect pairings
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                name: "Wedding Ready Bundle", 
                items: ["This Suit", "White Dress Shirt", "Silk Tie", "Pocket Square"], 
                price: 899, 
                originalPrice: 1059, 
                savings: 160,
                badge: "Most Popular"
              },
              { 
                name: "Business Essential", 
                items: ["This Suit", "Blue Dress Shirt", "Conservative Tie", "Leather Belt"], 
                price: 799, 
                originalPrice: 925, 
                savings: 126,
                badge: "AI Recommended"
              },
              { 
                name: "Complete Formal", 
                items: ["This Suit", "Shirt", "Tie", "Shoes", "Accessories"], 
                price: 1299, 
                originalPrice: 1549, 
                savings: 250,
                badge: "Best Value"
              }
            ].map((bundle, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{bundle.name}</h3>
                  <Badge className="bg-gold text-black">{bundle.badge}</Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  {bundle.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                      {item}
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold">{formatPrice(bundle.price)}</span>
                    <span className="text-gray-500 line-through">{formatPrice(bundle.originalPrice)}</span>
                  </div>
                  <div className="text-green-600 font-medium mb-4">
                    Save {formatPrice(bundle.savings)}
                  </div>
                  <Button className="w-full bg-gold hover:bg-gold/90 text-black">
                    Add Bundle to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Size Bot Modal */}
      <AnimatePresence>
        {showSizeBot && (
          <SizeBot 
            onSizeSelected={(size) => {
              // Find the variant with this size
              const variant = product.variants.find(v => v.size === size || v.size.includes(size));
              if (variant) {
                setSelectedSize(variant.size);
              }
              setShowSizeBot(false);
            }}
            onClose={() => setShowSizeBot(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}