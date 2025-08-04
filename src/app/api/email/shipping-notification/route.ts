import { NextRequest, NextResponse } from 'next/server'
import { sendShippingNotification } from '@/lib/email/service'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify the request is from our admin panel
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, trackingNumber, carrier, estimatedDelivery } = await request.json()

    // Fetch order details from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          product_name,
          product_image
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {

  }
}