import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// Disable body parsing, we need the raw body for webhook signature verification
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  
  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      try {
        // Parse order details from metadata
        const orderDetails = session.metadata?.order_details 
          ? JSON.parse(session.metadata.order_details) 
          : [];
        
        // Log the order for now (replace with Supabase save)
        console.log('Order completed:', {
          sessionId: session.id,
          customerEmail: session.customer_email,
          customerPhone: session.customer_details?.phone,
          amount: (session.amount_total || 0) / 100,
          items: orderDetails,
        });
        
        // TODO: Save to Supabase
        // const { error } = await supabase.from('orders').insert({
        //   stripe_session_id: session.id,
        //   stripe_payment_intent: session.payment_intent,
        //   customer_email: session.customer_email,
        //   customer_name: session.customer_details?.name,
        //   customer_phone: session.customer_details?.phone,
        //   shipping_address: session.shipping_details?.address,
        //   items: orderDetails,
        //   subtotal: (session.amount_subtotal || 0) / 100,
        //   tax: (session.total_details?.amount_tax || 0) / 100,
        //   total: (session.amount_total || 0) / 100,
        //   status: 'paid',
        //   created_at: new Date().toISOString(),
        // });
        
        // TODO: Send confirmation email
        // await sendOrderConfirmation(session, orderDetails);
        
      } catch (error) {
        console.error('Error processing order:', error);
        // Don't return error to Stripe, log it instead
      }
      break;
    }
    
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent.id);
      break;
    }
    
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', paymentIntent.id);
      break;
    }
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  return NextResponse.json({ received: true });
}