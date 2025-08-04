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
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-600" />
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Package className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Order Confirmed'
      case 'shipped':
        return 'Shipped'
      case 'completed':
        return 'Delivered'
      case 'failed':
        return 'Payment Failed'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'Processing'
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/account" className="hover:text-black">
              Account
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black">Order History</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              When you place your first order, it will appear here.
            </p>
            <Link
              href="/products"
              className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(order.status)}
                      <span className="font-semibold">
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Order #{order.order_number || order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      {formatCurrency(order.amount_total * 100, order.currency)}
                    </p>
                    {order.discount > 0 && (
                      <p className="text-sm text-green-600">
                        Saved {formatCurrency(order.discount * 100)}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      {order.order_items.length} {order.order_items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>

                {/* Tracking Info */}
                {order.tracking_number && (
                  <div className="bg-gray-50 rounded p-3 mb-4">
                    <p className="text-sm font-medium text-gray-700">
                      Tracking: {order.carrier} - {order.tracking_number}
                    </p>
                  </div>
                )}

                {/* Order Items Preview */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    {order.order_items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.product_name} × {item.quantity}
                        </span>
                        <span className="text-gray-900">
                          {formatCurrency(item.total_price)}
                        </span>
                      </div>
                    ))}
                    {order.order_items.length > 2 && (
                      <p className="text-sm text-gray-500">
                        +{order.order_items.length - 2} more items
                      </p>
                    )}
                  </div>
                </div>

                <Link
                  href={`/orders/${order.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm text-black hover:underline"
                >
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}