'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { primarySocialLinks } from '@/components/icons/SocialIcons'

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
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      toast.success('Successfully subscribed to newsletter!', {
        description: 'Thank you for joining our mailing list. Check your email for a welcome message!'
      })
      setEmail('')
    } catch (error) {
      toast.error('Failed to subscribe', {
        description: 'Please try again later.'
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <footer id="footer" className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-serif mb-4">KCT Menswear</h3>
            <p className="text-gray-400 mb-4">
              Elevate your style with premium men's formal wear. Quality craftsmanship since 1985.
            </p>
            <div className="flex gap-4">
              {primarySocialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gold transition-colors"
                    aria-label={`Follow us on ${link.name}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-400 hover:text-gold transition-colors">Shop All</Link></li>
              <li><Link href="/products/suits" className="text-gray-400 hover:text-gold transition-colors">Suits</Link></li>
              <li><Link href="/weddings" className="text-gray-400 hover:text-gold transition-colors">Weddings</Link></li>
              <li><Link href="/prom-collection" className="text-gray-400 hover:text-gold transition-colors">Prom</Link></li>
              <li><Link href="/custom-suits" className="text-gray-400 hover:text-gold transition-colors">Custom Suits</Link></li>
              <li><Link href="/alterations" className="text-gray-400 hover:text-gold transition-colors">Alterations</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-gold transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-gold transition-colors">Contact</Link></li>
              <li><Link href="/locations" className="text-gray-400 hover:text-gold transition-colors">Store Locations</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-gold transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-gold transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-gold transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
            <p className="text-gray-400 mb-4">Subscribe for exclusive offers and new arrivals</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 pr-12 bg-white/10 border border-white/20 rounded-sm text-white placeholder-gray-400 focus:outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-gold hover:bg-gold/90 text-black rounded-sm transition-colors disabled:opacity-50"
                  aria-label="Subscribe to newsletter"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Customer Service</p>
              <a href="tel:269-342-1234" className="flex items-center gap-2 text-gold hover:text-gold/80 transition-colors">
                <Phone className="w-4 h-4" />
                (269) 342-1234
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} KCT Menswear. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-gold transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-gold transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}