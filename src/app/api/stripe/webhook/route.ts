import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// This is your Stripe webhook secret
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  if (!endpointSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-10-28.acacia',
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  console.log(`Webhook received: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout completed:', session.id);
      
      // Extract order details from metadata
      const orderDetails = session.metadata?.order_details ? 
        JSON.parse(session.metadata.order_details) : null;
      
      // TODO: Save order to your database
      // TODO: Send confirmation email
      // TODO: Update inventory
      
      console.log('Order details:', orderDetails);
      console.log('Customer email:', session.customer_email);
      console.log('Shipping:', session.shipping_details);
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent.id);
      break;
    }

    case 'charge.updated': {
      const charge = event.data.object as Stripe.Charge;
      console.log('Charge updated:', charge.id);
      break;
    }

    case 'payment_intent.created': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment intent created:', paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true }, { status: 200 });
}

// Stripe requires raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};