import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const headersList = await headers();
    const signature = headersList.get("x-webhook-signature");
    
    if (!signature || signature !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = await request.json();
    const { event, data } = payload;

    switch (event) {
      case "order.created":
        await handleOrderCreated(data);
        break;
      case "order.updated":
        await handleOrderUpdated(data);
        break;
      case "order.fulfilled":
        await handleOrderFulfilled(data);
        break;
      case "order.cancelled":
        await handleOrderCancelled(data);
        break;
      default:
        console.log(`Unhandled order event: ${event}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handleOrderCreated(data: any) {
  const { orderId, customerId, items, total } = data;
  console.log(`New order created: ${orderId} for customer ${customerId}`);
  
  // Send order confirmation email
  // Update inventory
  // Create fulfillment task
}

async function handleOrderUpdated(data: any) {
  const { orderId, changes } = data;
  console.log(`Order ${orderId} updated:`, changes);
  
  // Notify customer of changes
  // Update local order cache
}

async function handleOrderFulfilled(data: any) {
  const { orderId, trackingNumber, carrier } = data;
  console.log(`Order ${orderId} fulfilled with tracking ${trackingNumber}`);
  
  // Send shipping notification
  // Update order status in UI
}

async function handleOrderCancelled(data: any) {
  const { orderId, reason } = data;
  console.log(`Order ${orderId} cancelled: ${reason}`);
  
  // Restock inventory
  // Process refund
  // Send cancellation email
}