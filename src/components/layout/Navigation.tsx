"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, User, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "@/lib/hooks/useCart";
import { SmartSearchBar } from "@/components/search/SmartSearchBar";

const navItems = [
  { href: "/products", label: "Shop" },
  { href: "/products/suits", label: "Suits" },
  { href: "/collections/ties", label: "Ties & Bowties", highlight: true },
  { href: "/style-quiz", label: "Style Finder" },
  { href: "/weddings", label: "Weddings" },
  { href: "/wedding-guide", label: "Wedding Guide", highlight: true },
  { href: "/prom-collection", label: "Prom", highlight: true },
  { href: "/occasions", label: "Occasions" },
  { href: "/builder", label: "Custom" },
  { href: "/cart", label: "Cart", mobileOnly: true },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartSummary } = useCart();

  return (
    <>
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gold/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
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
              >
                {item.label}
                {item.highlight && (
                  <span className="text-xs bg-gold text-black px-1.5 py-0.5 rounded-full font-semibold">
                    NEW
                  </span>
                )}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
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
            >
              <Search className="h-5 w-5 group-hover:text-gold transition-colors" />
            </button>
            <Link href="/account">
              <Button variant="ghost" size="icon" className="hover:text-gold transition-colors">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            {/* Cart button disabled - using SimpleCartDrawer instead */}
            {/* <Button 
              variant="ghost" 
              size="icon"
              className="relative hover:text-gold transition-colors"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartSummary.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-gold text-black text-xs font-bold rounded-full flex items-center justify-center animate-scale-in shadow-sm">
                  {cartSummary.itemCount}
                </span>
              )}
            </Button> */}
            <Button className="bg-black hover:bg-gray-900 text-white px-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              Book Appointment
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-16 left-0 w-full bg-white/98 backdrop-blur-md border-b border-gold/10 shadow-lg transition-all duration-300 ease-in-out",
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        <div className="px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 text-black hover:bg-gold/10 hover:text-gold rounded-sm transition-all duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-gold/20 flex flex-col space-y-2">
            <Link href="/account" className="w-full">
              <Button variant="outline" className="w-full border-gold/20 hover:bg-gold/10 hover:border-gold transition-all duration-200">
                <User className="h-4 w-4 mr-2" />
                Account
              </Button>
            </Link>
            {/* Mobile cart button disabled - using SimpleCartDrawer instead */}
            {/* <Button 
              variant="outline" 
              className="w-full relative border-gold/20 hover:bg-gold/10 hover:border-gold transition-all duration-200"
              onClick={() => {
                setIsMenuOpen(false);
                setIsCartOpen(true);
              }}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Cart
              {cartSummary.itemCount > 0 && (
                <span className="ml-1">({cartSummary.itemCount})</span>
              )}
            </Button> */}
            <Button className="w-full bg-gold hover:bg-gold/90 text-black font-semibold shadow-md">Book Appointment</Button>
          </div>
        </div>
      </div>
    </nav>
    
    {/* Cart Drawer - Disabled in favor of SimpleCartDrawer */}
    {/* <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> */}
    </>
  );
}