import { Resend } from 'resend'
import { OrderConfirmationEmail } from './templates/order-confirmation'
import { ShippingNotificationEmail } from './templates/shipping-notification'

// Lazy initialize Resend to avoid build-time errors
function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable is required')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

interface SendOrderConfirmationParams {
  to: string
  customerName: string
  orderNumber: string
  orderDate: string
  orderTotal: string
  items: Array<{
    name: string
    quantity: number
    price: string
    image?: string
  }>
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}

interface SendShippingNotificationParams {
  to: string
  customerName: string
  orderNumber: string
  trackingNumber: string
  carrier: string
  estimatedDelivery: string
  items: Array<{
    name: string
    quantity: number
    image?: string
  }>
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}

export async function sendOrderConfirmation(params: SendOrderConfirmationParams) {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: 'KCT Menswear <orders@kctmenswear.com>',
      to: params.to,
      subject: `Order Confirmation - ${params.orderNumber}`,
      react: OrderConfirmationEmail({
        customerName: params.customerName,
        orderNumber: params.orderNumber,
        orderDate: params.orderDate,
        orderTotal: params.orderTotal,
        items: params.items,
        shippingAddress: params.shippingAddress,
      }),
    })

    if (error) {
       // Assuming amount is in cents
}