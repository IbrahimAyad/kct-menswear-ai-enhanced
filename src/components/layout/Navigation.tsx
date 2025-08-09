"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, User, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "@/lib/hooks/useCart";
import { SmartSearchBar } from "@/components/search/SmartSearchBar";
import { InstantSearch } from "@/components/search/InstantSearch";
import { MegaMenu } from "./MegaMenu";
import UserMenu from "./UserMenu";
import MobileNavigation from "./MobileNavigation";
import { useStoreInfo } from "@/contexts/SettingsContext";

const navItems = [
  { href: "/products", label: "Shop" },
  { href: "/products/suits", label: "Suits" },
  { href: "/collections/dress-shirts", label: "Dress Shirts", highlight: true },
  { href: "/collections/ties", label: "Ties & Bowties", highlight: true },
  { href: "/style-quiz", label: "Stylin' Profilin'" },
  { href: "/occasions", label: "Occasions" },
  { href: "/custom-suits", label: "Custom" },
  { href: "/cart", label: "Cart", mobileOnly: true },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartSummary } = useCart();
  const storeInfo = useStoreInfo();

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
    <nav 
      id="navigation"
      className="luxury-header fixed top-0 w-full z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center group"
            aria-label={`${storeInfo.name} - Home`}
          >
            {storeInfo.logo && storeInfo.logo !== '/KCTLogo.jpg' ? (
              <img 
                src={storeInfo.logo} 
                alt={storeInfo.name}
                className="h-8 w-auto transition-transform group-hover:scale-105"
              />
            ) : (
              <h1 className="logo-brand">
                <span className="logo-primary">
                  {storeInfo.name.split(' ')[0] || 'KCT'}
                </span>
                <span className="logo-secondary">
                  {storeInfo.name.split(' ')[1] || 'Menswear'}
                </span>
              </h1>
            )}
          </Link>

          {/* Desktop Navigation with MegaMenu */}
          <div className="hidden md:flex items-center">
            <MegaMenu />
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="p-2 hover:bg-gray-100 rounded-sm transition-colors group relative"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search products (⌘K)"
            >
              <Search className="h-5 w-5 group-hover:text-burgundy transition-colors" />
              <div className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="px-1 py-0.5 text-xs text-gray-500 bg-gray-100 rounded border text-xs">
                  ⌘K
                </div>
              </div>
            </button>
            <UserMenu />
            <Button 
              variant="ghost" 
              size="icon"
              className="relative hover:text-burgundy transition-colors"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping cart with ${cartSummary.itemCount} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartSummary.itemCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 h-5 w-5 text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in shadow-sm"
                  style={{ backgroundColor: 'var(--burgundy)' }}
                >
                  {cartSummary.itemCount}
                </span>
              )}
            </Button>
            <Button 
              className="btn-burgundy px-6 shadow-md hover:scale-105"
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

      {/* Enhanced Mobile Navigation */}
      <MobileNavigation 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </nav>
    
    {/* Instant Search */}
    <InstantSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    
    {/* Cart Drawer - Disabled in favor of SimpleCartDrawer */}
    {/* <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> */}
    </>
  );
}