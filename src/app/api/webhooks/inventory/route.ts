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
      case "inventory.updated":
        await handleInventoryUpdate(data);
        break;
      case "inventory.low_stock":
        await handleLowStock(data);
        break;
      case "inventory.out_of_stock":
        await handleOutOfStock(data);
        break;
      default:
        console.log(`Unhandled inventory event: ${event}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handleInventoryUpdate(data: any) {
  const { sku, stock } = data;
  console.log(`Inventory updated for SKU ${sku}:`, stock);
  
  // Here you would typically:
  // 1. Update local cache
  // 2. Notify connected clients via websocket
  // 3. Update any pending orders
}

async function handleLowStock(data: any) {
  const { sku, size, currentStock, threshold } = data;
  console.log(`Low stock alert: SKU ${sku} size ${size} has ${currentStock} items (threshold: ${threshold})`);
  
  // Send notification to admin
  // Update product display to show limited availability
}

async function handleOutOfStock(data: any) {
  const { sku, size } = data;
  console.log(`Out of stock: SKU ${sku} size ${size}`);
  
  // Remove from available options
  // Notify customers with items in cart
  // Suggest alternatives
}