import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmation, formatOrderDate, formatCurrency } from '@/lib/email/service'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify the request is from our webhook by checking a secret
    const webhookSecret = request.headers.get('x-webhook-secret')
    if (webhookSecret !== process.env.INTERNAL_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId } = await request.json()

    // Fetch order details from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          product_id,
          variant_id,
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

    // Format items for email
    const items = order.order_items.map((item: any) => ({
      name: item.product_name,
      quantity: item.quantity,
      price: formatCurrency(item.price),
      image: item.product_image,
    }))

    // Send email
    await sendOrderConfirmation({
      to: order.customer_email,
      customerName: order.customer_name || 'Valued Customer',
      orderNumber: order.id,
      orderDate: formatOrderDate(new Date(order.created_at)),
      orderTotal: formatCurrency(order.amount_total),
      items,
      shippingAddress: order.shipping_address,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to send order confirmation:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}