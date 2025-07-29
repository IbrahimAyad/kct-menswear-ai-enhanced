'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getCloudflareOptimizedUrl, imagePresets } from '@/lib/cloudflare/imageTransform';
import type { ImageTransformOptions } from '@/lib/cloudflare/imageTransform';

interface OptimizedImageProps {
  src: string;
  alt: string;
  preset?: keyof typeof imagePresets;
  transformOptions?: ImageTransformOptions;
  lazy?: boolean;
  priority?: boolean;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

export default function OptimizedImage({
  src,
  alt,
  preset = 'card',
  transformOptions,
  lazy = true,
  priority = false,
  className = '',
  onLoad,
  onError,
  fallbackSrc = '/placeholder-suit.jpg',
  sizes,
  fill = false,
  width,
  height,
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(!lazy);
  const imageRef = useRef<HTMLDivElement>(null);

  // Get optimized URL
  const optimizedSrc = getCloudflareOptimizedUrl(
    imageSrc,
    transformOptions || preset
  );

  // Get placeholder for lazy loading
  const placeholderSrc = lazy 
    ? getCloudflareOptimizedUrl(imageSrc, { width: 40, quality: 20, blur: 10 })
    : undefined;

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(imageRef.current);

    return () => observer.disconnect();
  }, [lazy]);

  const handleError = () => {
    setImageSrc(fallbackSrc);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  // Get dimensions from preset if not provided
  const dimensions = !fill && !width && !height && preset
    ? imagePresets[preset]
    : { width, height };

  return (
    <div ref={imageRef} className={`relative ${className}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}

      {/* Main image */}
      {isInView && (
        <Image
          src={optimizedSrc}
          alt={alt}
          fill={fill}
          width={fill ? undefined : dimensions.width}
          height={fill ? undefined : dimensions.height}
          sizes={responsiveSizes}
          priority={priority}
          placeholder={placeholderSrc ? 'blur' : undefined}
          blurDataURL={placeholderSrc}
          className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          quality={100} // Let Cloudflare handle quality
          unoptimized={false} // Let Next.js optimize too
        />
      )}

      {/* Low quality placeholder for lazy loading */}
      {!isInView && placeholderSrc && (
        <Image
          src={placeholderSrc}
          alt={alt}
          fill={fill}
          width={fill ? undefined : dimensions.width}
          height={fill ? undefined : dimensions.height}
          className="blur-sm"
          priority={false}
          unoptimized
        />
      )}
    </div>
  );
}

// Preload component for critical images
export function PreloadImages({ images }: { images: string[] }) {
  useEffect(() => {
    images.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = getCloudflareOptimizedUrl(src, 'gallery');
      link.type = 'image/webp';
      document.head.appendChild(link);
    });
  }, [images]);

  return null;
}