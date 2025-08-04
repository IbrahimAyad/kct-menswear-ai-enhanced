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

  }
}