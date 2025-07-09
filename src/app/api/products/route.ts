import { NextRequest, NextResponse } from 'next/server';

const ADMIN_API_KEY = process.env.ADMIN_BACKEND_API_KEY || '0aadbad87424e6f468ce0fdb18d1462fd03b133c1b48fd805fab14d4bac3bd75';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  return NextResponse.json([
    {
      id: "NVY-SUIT-001",
      name: "Navy Blue Classic Suit",
      description: "Timeless navy blue suit perfect for business and formal occasions",
      price: 599.99,
      category: "suits" as const,
      subcategory: "business",
      images: ["/images/suits/navy-classic.jpg"],
      sizes: ["36R", "38R", "40R", "42R", "44R", "46R"],
      colors: ["Navy Blue"],
      inStock: true,
      featured: true,
      details: {
        material: "100% Wool",
        fit: "Modern Fit",
        care: "Dry Clean Only",
        features: ["Half Canvas", "Notch Lapel", "Two Button"]
      }
    },
    {
      id: "CHR-SUIT-002",
      name: "Charcoal Grey Business Suit",
      description: "Sophisticated charcoal suit ideal for executive meetings",
      price: 649.99,
      category: "suits" as const,
      subcategory: "business",
      images: ["/images/suits/charcoal-business.jpg"],
      sizes: ["38R", "40R", "42R", "44R"],
      colors: ["Charcoal Grey"],
      inStock: true,
      featured: false,
      details: {
        material: "Wool Blend",
        fit: "Slim Fit",
        care: "Dry Clean Only",
        features: ["Full Canvas", "Peak Lapel", "Two Button"]
      }
    },
    {
      id: "GRY-SUIT-003",
      name: "Light Grey Summer Suit",
      description: "Breathable light grey suit perfect for warm weather",
      price: 549.99,
      category: "suits" as const,
      subcategory: "casual",
      images: ["/images/suits/light-grey-summer.jpg"],
      sizes: ["36R", "38R", "40R", "42R"],
      colors: ["Light Grey"],
      inStock: true,
      featured: false,
      details: {
        material: "Linen Blend",
        fit: "Regular Fit",
        care: "Dry Clean Recommended",
        features: ["Unlined", "Notch Lapel", "Two Button"]
      }
    },
    {
      id: "BLK-TUX-001",
      name: "Black Peak Lapel Tuxedo",
      description: "Elegant black tuxedo for formal events",
      price: 899.99,
      category: "tuxedos" as const,
      subcategory: "formal",
      images: ["/images/tuxedos/black-peak-lapel.jpg"],
      sizes: ["38R", "40R", "42R", "44R", "46R"],
      colors: ["Black"],
      inStock: true,
      featured: true,
      details: {
        material: "Premium Wool",
        fit: "Modern Fit",
        care: "Dry Clean Only",
        features: ["Satin Lapels", "One Button", "Side Stripe Trousers"]
      }
    }
  ].filter(product => !category || category === 'all' || product.category === category));
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    },
  });
}