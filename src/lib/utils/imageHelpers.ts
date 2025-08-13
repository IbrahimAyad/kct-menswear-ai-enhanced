// Image helper utilities

export const FALLBACK_PRODUCT_IMAGE = '/placeholder-product.jpg';

export function getProductImageUrl(imageUrl: string | undefined | null): string {
  if (!imageUrl) return FALLBACK_PRODUCT_IMAGE;
  
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
  
  // Handle R2/S3 URLs
  if (imageUrl.includes('.r2.dev') || imageUrl.includes('amazonaws.com')) {
    return imageUrl;
  }
  
  // Default to treating as relative path
  return `/${imageUrl}`;
}

export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>) {
  const img = event.currentTarget;
  img.src = FALLBACK_PRODUCT_IMAGE;
  img.onerror = null; // Prevent infinite loop
}