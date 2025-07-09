import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const products = [
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
  ];

  const product = products.find(p => p.id === id);
  
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  
  return NextResponse.json(product);
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