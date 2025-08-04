'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, ChevronRight, Truck, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/email/service'

interface Order {
  id: string
  order_number: string
  created_at: string
  status: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'failed'
  amount_total: number
  amount_subtotal: number
  discount: number
  currency: string
  tracking_number?: string
  carrier?: string
  bundle_info?: {
    is_bundle: boolean
    bundle_type: string
    bundle_name: string
  }
  order_items: Array<{
    id: string
    quantity: number
    unit_price: number
    total_price: number
    product_name: string
    product_image?: string
    attributes?: {
      color?: string
      size?: string
      style?: string
    }
  }>
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirectTo=/orders')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            unit_price,
            total_price,
            product_name,
            product_image,
            attributes
          )
        `)
        .eq('customer_email', user?.email)
        .order('created_at', { ascending: false })

      if (error) throw error

      setOrders(data || [])
    } catch (error) {

}