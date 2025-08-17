// Image helper utilities

export const FALLBACK_PRODUCT_IMAGE = '/placeholder-product.jpg';

// CDN fallback images by category
export const CDN_FALLBACKS = {
  suit: 'https://cdn.kctmenswear.com/placeholder/suit.png',
  shirt: 'https://cdn.kctmenswear.com/placeholder/shirt.png',
  tie: 'https://cdn.kctmenswear.com/placeholder/tie.png',
  bundle: 'https://cdn.kctmenswear.com/placeholder/bundle.png',
  default: 'https://cdn.kctmenswear.com/placeholder/product.png',
};

// Map broken R2 URLs to working CDN URLs
const R2_TO_CDN_MAP: Record<string, string> = {
  // Bundle images
  'kct-prodcuts/Bundles-Augest-2025': 'products/bundles',
  'kct-prodcuts/Dress%20Shirts': 'products/shirts',
  'kct-prodcuts/Bow%3ATie': 'products/ties',
  'kct-prodcuts/suits': 'products/suits',
};

export function getProductImageUrl(imageUrl: string | undefined | null, category?: string): string {
  if (!imageUrl) return category ? CDN_FALLBACKS[category as keyof typeof CDN_FALLBACKS] || FALLBACK_PRODUCT_IMAGE : FALLBACK_PRODUCT_IMAGE;
  
  // Fix broken R2 URLs
  if (imageUrl.includes('pub-46371bda6faf4910b74631159fc2dfd4.r2.dev')) {
    // Try to map to CDN URL
    for (const [r2Path, cdnPath] of Object.entries(R2_TO_CDN_MAP)) {
      if (imageUrl.includes(r2Path)) {
        // Extract filename and construct CDN URL
        const filename = imageUrl.split('/').pop()?.split('.')[0] || 'main';
        return `https://cdn.kctmenswear.com/${cdnPath}/${filename}.png`;
      }
    }
    // If no mapping found, return category-based fallback
    return category ? CDN_FALLBACKS[category as keyof typeof CDN_FALLBACKS] || CDN_FALLBACKS.default : CDN_FALLBACKS.default;
  }
  
  // Handle relative URLs
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  // Handle absolute URLs
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Handle Cloudflare Images
  if (imageUrl.includes('imagedelivery.net')) {
    return imageUrl;
  }
  
  // Handle other R2/S3 URLs
  if (imageUrl.includes('.r2.dev') || imageUrl.includes('amazonaws.com')) {
    return imageUrl;
  }
  
  // Default to treating as relative path
  return `/${imageUrl}`;
}

export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>, category?: string) {
  const img = event.currentTarget;
  const fallback = category ? CDN_FALLBACKS[category as keyof typeof CDN_FALLBACKS] || FALLBACK_PRODUCT_IMAGE : FALLBACK_PRODUCT_IMAGE;
  
  // Prevent infinite loop by checking if we're already using a fallback
  if (img.src !== fallback && img.src !== FALLBACK_PRODUCT_IMAGE) {
    img.src = fallback;
    img.onerror = null; // Prevent further errors
  }
}