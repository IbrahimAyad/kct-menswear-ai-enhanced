import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

interface PriceWebhookPayload {
  event: "price.updated" | "price.sale_started" | "price.sale_ended";
  timestamp: string;
  data: {
    sku: string;
    productId: string;
    changes: {
      previousPrice: number;
      currentPrice: number;
      salePrice?: number;
      saleEndDate?: string;
      reason: string;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const headersList = await headers();
    const signature = headersList.get("x-admin-signature");
    
    if (!signature || signature !== process.env.ADMIN_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload: PriceWebhookPayload = await request.json();
    const { event, data } = payload;

    console.log(`Received price webhook: ${event} for SKU ${data.sku}`);

    switch (event) {
      case "price.updated":
        await handlePriceUpdated(data);
        break;
      case "price.sale_started":
        await handleSaleStarted(data);
        break;
      case "price.sale_ended":
        await handleSaleEnded(data);
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Price webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handlePriceUpdated(data: any) {
  const { sku, productId, changes } = data;
  
  // Check if price decreased
  if (changes.currentPrice < changes.previousPrice) {
    const discount = Math.round(
      ((changes.previousPrice - changes.currentPrice) / changes.previousPrice) * 100
    );
    
    // Notify customers who have this in wishlist or cart
    await notifyPriceDropSubscribers(sku, productId, {
      previousPrice: changes.previousPrice,
      currentPrice: changes.currentPrice,
      discountPercentage: discount,
    });
  }
  
  // Update all caches
  await invalidatePriceCaches(productId);
}

async function handleSaleStarted(data: any) {
  const { sku, productId, changes } = data;
  
  console.log(`Sale started for ${sku}: ${changes.salePrice}`);
  
  // Send sale notifications
  await notifySaleSubscribers(productId, {
    regularPrice: changes.previousPrice,
    salePrice: changes.salePrice!,
    endDate: changes.saleEndDate,
  });
  
  // Update homepage banners if featured
  await updateSaleBanners(productId);
}

async function handleSaleEnded(data: any) {
  const { sku, productId } = data;
  
  console.log(`Sale ended for ${sku}`);
  
  // Remove from sale sections
  // Update caches
  await invalidatePriceCaches(productId);
}

async function notifyPriceDropSubscribers(
  sku: string,
  productId: string,
  priceInfo: any
) {
  // Query customers with price drop alerts
  // Send personalized emails
  console.log(`Notifying price drop for ${sku}:`, priceInfo);
}

async function notifySaleSubscribers(productId: string, saleInfo: any) {
  // Send sale notifications to subscribers
  console.log(`Notifying sale for product ${productId}:`, saleInfo);
}

async function updateSaleBanners(productId: string) {
  // Update dynamic sale banners
  // Refresh homepage if product is featured
}

async function invalidatePriceCaches(productId: string) {
  // Invalidate all pages showing this product's price
  try {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": process.env.REVALIDATE_TOKEN || "",
      },
      body: JSON.stringify({
        tags: [`product-${productId}`, "prices"],
      }),
    });
  } catch (error) {
    console.error("Price cache invalidation failed:", error);
  }
}