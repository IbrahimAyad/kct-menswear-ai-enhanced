// Core Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  category_id: string;
  brand?: string;
  sku: string;
  inventory_quantity: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images: ProductImage[];
  variants?: ProductVariant[];
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text?: string;
  position: number;
  width?: number;
  height?: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  title: string;
  price: number;
  compare_at_price?: number;
  sku: string;
  inventory_quantity: number;
  weight?: number;
  options: VariantOption[];
  image_id?: string;
}

export interface VariantOption {
  name: string; // e.g., "Size", "Color"
  value: string; // e.g., "Large", "Navy"
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  position: number;
  meta_title?: string;
  meta_description?: string;
  status: 'active' | 'draft';
  created_at: string;
  updated_at: string;
}

// Cart Types
export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
  product: Product;
  variant?: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  total_items: number;
  total_price: number;
  subtotal: number;
  shipping_cost?: number;
  tax_amount?: number;
}

// User & Auth Types
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  type: 'shipping' | 'billing';
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
}

// Order Types
export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  shipping_address: Address;
  billing_address: Address;
  items: OrderItem[];
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
  total: number;
  product_name: string;
  product_sku: string;
  variant_title?: string;
}

// Bundle Builder Types
export interface Bundle {
  id: string;
  name: string;
  description: string;
  items: BundleItem[];
  base_price: number;
  discount_percentage: number;
  final_price: number;
  category: 'wedding' | 'prom' | 'business' | 'casual';
  created_at: string;
}

export interface BundleItem {
  id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  product: Product;
  variant?: ProductVariant;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// Filter Types
export interface ProductFilters {
  category?: string;
  price_min?: number;
  price_max?: number;
  sizes?: string[];
  colors?: string[];
  brands?: string[];
  tags?: string[];
  sort_by?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest' | 'featured';
  search?: string;
}

// AI Integration Types
export interface AtelierAIResponse {
  response: string;
  confidence: number;
  context?: any;
}

export interface FashionCLIPResponse {
  matches: {
    product_id: string;
    similarity_score: number;
    product: Product;
  }[];
}

export interface SizeBotResponse {
  recommended_size: string;
  confidence: number;
  measurements: {
    chest?: number;
    waist?: number;
    inseam?: number;
    neck?: number;
  };
  notes?: string;
}