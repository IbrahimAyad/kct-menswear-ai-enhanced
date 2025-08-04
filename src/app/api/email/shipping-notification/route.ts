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
      console.error('Failed to fetch order:', orderError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Update order with tracking info
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        tracking_number: trackingNumber,
        carrier,
        status: 'shipped',
        shipped_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Failed to update order:', updateError)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    // Format items for email
    const items = order.order_items.map((item: any) => ({
      name: item.product_name,
      quantity: item.quantity,
      image: item.product_image,
    }))

    // Send email
    await sendShippingNotification({
      to: order.customer_email,
      customerName: order.customer_name || 'Valued Customer',
      orderNumber: order.id,
      trackingNumber,
      carrier,
      estimatedDelivery,
      items,
      shippingAddress: order.shipping_address,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to send shipping notification:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}