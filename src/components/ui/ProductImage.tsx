"use client"

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

interface ProductImageProps {
  src: string | undefined
  alt: string
  className?: string
  sizes?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
}

export function ProductImage({
  src,
  alt,
  className,
  sizes,
  fill = true,
  width,
  height,
  priority = false,
  onLoad,
  onError
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
    onError?.()
  }

  const handleImageLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  // Get valid image URL with fallbacks
  const getValidImageUrl = (url: string | undefined): string => {
    if (!url || url.trim() === '') return '/placeholder-product.svg'
    
    // Check if URL looks valid
    try {
      new URL(url)
      return url
    } catch {
      // If not a valid URL, assume it's a relative path
      if (url.startsWith('/')) return url
      return '/placeholder-product.svg'
    }
  }

  const imageSrc = imageError ? '/placeholder-product.svg' : getValidImageUrl(src)
  const isPlaceholder = imageError || imageSrc === '/placeholder-product.svg'

  const imageProps = {
    src: imageSrc,
    alt: alt || 'Product image',
    className: cn(
      'transition-all duration-300',
      isLoading && 'opacity-0',
      !isLoading && 'opacity-100',
      className
    ),
    onError: handleImageError,
    onLoad: handleImageLoad,
    unoptimized: isPlaceholder,
    priority,
    sizes: sizes || (fill ? '(max-width: 768px) 100vw, 300px' : undefined)
  }

  return (
    <div className="relative">
      {/* Loading skeleton */}
      {isLoading && (
        <div className={cn(
          'absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse',
          fill && 'w-full h-full'
        )} />
      )}
      
      {/* Image */}
      {fill ? (
        <Image
          {...imageProps}
          fill
        />
      ) : (
        <Image
          {...imageProps}
          width={width || 300}
          height={height || 400}
        />
      )}
    </div>
  )
}