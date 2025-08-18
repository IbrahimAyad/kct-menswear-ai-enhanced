import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwindcss-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function for formatting currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// Utility function for formatting dates
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

// Utility function for generating slugs
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Utility function for calculating discounts
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

// Utility function for checking if a product is on sale
export function isOnSale(product: { price: number; compare_at_price?: number }): boolean {
  return !!product.compare_at_price && product.compare_at_price > product.price;
}

// Utility function for safe array operations (defensive programming)
export function safeArray<T>(items: T[] | null | undefined): T[] {
  return items || [];
}

// Utility function for safe object property access
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  return obj?.[key];
}

// Utility function for debouncing
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Utility function for throttling
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCallTime >= delay) {
      lastCallTime = now;
      func(...args);
    }
  };
}

// Utility function for image optimization
export function optimizeImageUrl(
  url: string,
  width?: number,
  height?: number,
  quality: number = 85
): string {
  if (!url) return '';
  
  // If using KCT CDN, apply optimization parameters
  if (url.includes('cdn.kctmenswear.com')) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    params.set('f', 'webp');
    
    return `${url}?${params.toString()}`;
  }
  
  return url;
}

// Utility function for generating product URLs
export function getProductUrl(product: { slug: string; id: string }): string {
  return `/products/${product.slug}`;
}

// Utility function for generating category URLs
export function getCategoryUrl(category: { slug: string }): string {
  return `/collections/${category.slug}`;
}

// Utility function for safe JSON parsing
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

// Utility function for validating email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Utility function for generating order numbers
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 5);
  return `KCT-${timestamp}-${randomStr}`.toUpperCase();
}