import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gvcswimqaxvylgxbklbz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2Y3N3aW1xYXh2eWxneGJrbGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NjA1MzAsImV4cCI6MjA2OTMzNjUzMH0.UZdiGcJXUV5VYetjWXV26inmbj2yXdiT03Z6t_5Lg24'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  type: 'core' | 'catalog' | 'bundle'
  images: {
    hero?: { url: string; cdn_url: string }
    primary?: { cdn_url: string }
    gallery?: Array<{ url: string; cdn_url: string }>
  }
  sizes?: string[]
  colors?: string[]
  sku: string
  inventory_count?: number
  is_featured: boolean
  is_trending: boolean
  is_new_arrival: boolean
  stripe_product_id?: string
  stripe_price_id?: string
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  product_id: string
  product: Product
  quantity: number
  size?: string
  color?: string
  price: number
}

export interface Order {
  id: string
  user_id?: string
  order_number: string
  status: OrderStatus
  total_amount: number
  subtotal: number
  tax_amount?: number
  shipping_amount?: number
  discount_amount?: number
  currency: string
  customer_email?: string
  customer_name?: string
  customer_phone?: string
  shipping_address?: Address
  billing_address?: Address
  payment_method?: string
  stripe_payment_intent_id?: string
  tracking_number?: string
  created_at: string
  updated_at: string
}

export interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  name?: string
  phone?: string
}

export type OrderStatus = 
  | 'pending_payment'
  | 'payment_confirmed' 
  | 'processing'
  | 'in_production'
  | 'quality_check'
  | 'packaging'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded'

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  phone?: string
  date_of_birth?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}
