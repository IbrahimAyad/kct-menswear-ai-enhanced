"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, User, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "@/lib/hooks/useCart";
import { SmartSearchBar } from "@/components/search/SmartSearchBar";
import UserMenu from "./UserMenu";

const navItems = [
  { href: "/products", label: "Shop" },
  { href: "/products/suits", label: "Suits" },
  { href: "/collections/dress-shirts", label: "Dress Shirts", highlight: true },
  { href: "/collections/ties", label: "Ties & Bowties", highlight: true },
  { href: "/style-quiz", label: "Style Finder" },
  { href: "/weddings", label: "Weddings" },
  { href: "/wedding-guide", label: "Wedding Guide", highlight: true },
  { href: "/prom-collection", label: "Prom", highlight: true },
  { href: "/occasions", label: "Occasions" },
  { href: "/custom-suits", label: "Custom" },
  { href: "/cart", label: "Cart", mobileOnly: true },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartSummary } = useCart();

  return (
    <>
    <nav 
      id="navigation"
      className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gold/10 shadow-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center group"
            aria-label="KCT Menswear - Home"
          >
            <h1 className="text-2xl font-serif font-bold text-black transition-all duration-300">
              <span className="inline-block transition-transform group-hover:scale-105">KCT</span>
              <span className="text-gold ml-1">Menswear</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.filter(item => !item.mobileOnly).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-black hover:text-gold transition-colors font-medium group ${
                  item.highlight ? 'flex items-center gap-1' : ''
                }`}
                aria-label={`Navigate to ${item.label}${item.highlight ? ' - New' : ''}`}
              >
                {item.label}
                {item.highlight && (
                  <span className="text-xs bg-gold text-black px-1.5 py-0.5 rounded-full font-semibold" aria-label="New section">
                    NEW
                  </span>
                )}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" aria-hidden="true"></span>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="p-2 hover:bg-gray-100 rounded-sm transition-colors group"
              onClick={() => {
                // Open search modal or focus search input
                const searchElement = document.querySelector('[data-search-trigger]') as HTMLElement;
                searchElement?.click();
              }}
              aria-label="Search products"
            >
              <Search className="h-5 w-5 group-hover:text-gold transition-colors" />
            </button>
            <UserMenu />
            <Button 
              variant="ghost" 
              size="icon"
              className="relative hover:text-gold transition-colors"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping cart with ${cartSummary.itemCount} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartSummary.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-gold text-black text-xs font-bold rounded-full flex items-center justify-center animate-scale-in shadow-sm">
                  {cartSummary.itemCount}
                </span>
              )}
            </Button>
            <Button 
              className="bg-black hover:bg-gray-900 text-white px-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              aria-label="Book an appointment for custom fitting"
            >
              Book Appointment
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-navigation"
        className={cn(
          "md:hidden fixed top-16 left-0 w-full bg-white border-b border-gray-200 shadow-xl transition-all duration-300 ease-in-out z-40 max-h-[calc(100vh-4rem)] overflow-y-auto",
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        )}
        role="navigation"
        aria-label="Mobile navigation menu"
      >
        <div className="px-4 py-6">
          {/* Main Navigation Items */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3 text-base font-medium text-gray-900 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-all duration-200",
                  item.highlight && "relative"
                )}
                onClick={() => setIsMenuOpen(false)}
                aria-label={`Navigate to ${item.label}`}
              >
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-full font-semibold ml-2">
                    NEW
                  </span>
                )}
              </Link>
            ))}
          </div>
          
          {/* Divider */}
          <div className="my-6 border-t border-gray-200"></div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/account" className="block" aria-label="Go to your account">
              <Button 
                variant="outline" 
                className="w-full justify-start border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 h-12"
              >
                <User className="h-5 w-5 mr-3" aria-hidden="true" />
                <span className="text-base">Account</span>
              </Button>
            </Link>
            
            <Button 
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-md h-12 text-base"
              aria-label="Book an appointment for custom fitting"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    </nav>
    
    {/* Cart Drawer - Disabled in favor of SimpleCartDrawer */}
    {/* <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> */}
    </>
  );
}