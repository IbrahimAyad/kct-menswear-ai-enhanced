'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    setIsSubscribing(true)
    try {
      // TODO: Implement newsletter signup API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      toast.success('Successfully subscribed to newsletter!', {
        description: 'Thank you for joining our mailing list.'
      })
      setEmail('')
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setIsSubscribing(false)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-black py-12 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">Stay in Style</h3>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter for exclusive offers, style tips, and new collection updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-white placeholder-gray-500"
                disabled={isSubscribing}
              />
              <Button
                type="submit"
                disabled={isSubscribing}
                className="bg-gold hover:bg-gold/90 text-black font-medium px-6 py-3"
              >
                {isSubscribing ? (
                  'Subscribing...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Subscribe
                  </>
                )}
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-gold">KCT Menswear</h4>
            <p className="text-gray-400 mb-4 text-sm">
              Premium men's formal wear and expert tailoring services. Elevating your style since establishment.
            </p>
            <div className="space-y-2">
              <a href="tel:313-525-2424" className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors text-sm">
                <Phone className="h-4 w-4" />
                313-525-2424
              </a>
              <a href="mailto:info@kctmenswear.com" className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors text-sm">
                <Mail className="h-4 w-4" />
                info@kctmenswear.com
              </a>
              <div className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Detroit, Michigan</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/collections/suits" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Suits
                </Link>
              </li>
              <li>
                <Link href="/collections/wedding" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Wedding Collection
                </Link>
              </li>
              <li>
                <Link href="/collections/prom" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Prom Collection
                </Link>
              </li>
              <li>
                <Link href="/collections/accessories" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/bundles" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Bundle Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/alterations" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Alterations
                </Link>
              </li>
              <li>
                <Link href="/rental" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Suit Rental
                </Link>
              </li>
              <li>
                <Link href="/wedding/sign-up" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Wedding Party Sign Up
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} KCT Menswear. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://facebook.com/kctmenswear" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com/kctmenswear" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/kctmenswear" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com/kctmenswear" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Secure payments:</span>
              <span className="font-mono">Visa</span>
              <span className="font-mono">MC</span>
              <span className="font-mono">Amex</span>
              <span className="font-mono">PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}