'use client'

import { useState } from 'react'

export function SkipLinks() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div
      className={`fixed top-0 left-0 z-[100] transition-transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <a
        href="#main-content"
        className="bg-gold text-black px-4 py-2 font-medium focus:translate-y-0"
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="bg-gold text-black px-4 py-2 font-medium ml-2 focus:translate-y-0"
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        Skip to navigation
      </a>
      <a
        href="#footer"
        className="bg-gold text-black px-4 py-2 font-medium ml-2 focus:translate-y-0"
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        Skip to footer
      </a>
    </div>
  )
}