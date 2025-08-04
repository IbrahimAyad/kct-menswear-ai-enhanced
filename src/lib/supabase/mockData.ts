import { EnhancedProduct } from './types'

export const mockProducts: EnhancedProduct[] = [
  {
    id: 'mock-1',
    name: 'Classic Black Tuxedo',
    description: 'Elegant black tuxedo perfect for formal occasions',
    price: 59900, // $599.00 in cents
    compareAtPrice: 89900,
    primaryImage: '/placeholder-product.svg',
    images: ['/placeholder-product.svg'],
    category: 'Formal Wear',
    productType: 'Tuxedo',
    brand: 'KCT Premium',
    sku: 'TUX-BLK-001',
    inStock: true,
    inventory: 25,
    variants: [
      { id: 'v1', productId: 'mock-1', option1: '38R', option2: null, option3: null, price: 59900, sku: 'TUX-BLK-001-38R', inventory: 5 },
      { id: 'v2', productId: 'mock-1', option1: '40R', option2: null, option3: null, price: 59900, sku: 'TUX-BLK-001-40R', inventory: 8 },
      { id: 'v3', productId: 'mock-1', option1: '42R', option2: null, option3: null, price: 59900, sku: 'TUX-BLK-001-42R', inventory: 7 },
      { id: 'v4', productId: 'mock-1', option1: '44R', option2: null, option3: null, price: 59900, sku: 'TUX-BLK-001-44R', inventory: 5 }
    ],
    tags: ['formal', 'tuxedo', 'wedding', 'black-tie'],
    occasions: ['Wedding', 'Gala', 'Black Tie'],
    colorFamily: 'Black',
    isFeatured: true,
    trendingScore: 95,
    status: 'active'
  },
  {
    id: 'mock-2',
    name: 'Navy Blue Business Suit',
    description: 'Professional navy suit for business and formal events',
    price: 44900, // $449.00 in cents
    compareAtPrice: 59900,
    primaryImage: '/placeholder-product.svg',
    images: ['/placeholder-product.svg'],
    category: 'Formal Wear',
    productType: 'Suit',
    brand: 'KCT Executive',
    sku: 'SUIT-NAV-001',
    inStock: true,
    inventory: 30,
    variants: [
      { id: 'v5', productId: 'mock-2', option1: '38R', option2: null, option3: null, price: 44900, sku: 'SUIT-NAV-001-38R', inventory: 8 },
      { id: 'v6', productId: 'mock-2', option1: '40R', option2: null, option3: null, price: 44900, sku: 'SUIT-NAV-001-40R', inventory: 10 },
      { id: 'v7', productId: 'mock-2', option1: '42R', option2: null, option3: null, price: 44900, sku: 'SUIT-NAV-001-42R', inventory: 7 },
      { id: 'v8', productId: 'mock-2', option1: '44R', option2: null, option3: null, price: 44900, sku: 'SUIT-NAV-001-44R', inventory: 5 }
    ],
    tags: ['business', 'suit', 'navy', 'professional'],
    occasions: ['Business', 'Interview', 'Formal Event'],
    colorFamily: 'Blue',
    isFeatured: true,
    trendingScore: 88,
    status: 'active'
  },
  {
    id: 'mock-3',
    name: 'Silk Bow Tie Set',
    description: 'Luxury silk bow tie with matching pocket square',
    price: 7900, // $79.00 in cents
    compareAtPrice: 9900,
    primaryImage: '/placeholder-product.svg',
    images: ['/placeholder-product.svg'],
    category: 'Vest & Accessory Sets',
    productType: 'Accessory',
    brand: 'KCT Accessories',
    sku: 'ACC-BOW-001',
    inStock: true,
    inventory: 50,
    variants: [
      { id: 'v9', productId: 'mock-3', option1: 'Black', option2: null, option3: null, price: 7900, sku: 'ACC-BOW-001-BLK', inventory: 20 },
      { id: 'v10', productId: 'mock-3', option1: 'Navy', option2: null, option3: null, price: 7900, sku: 'ACC-BOW-001-NAV', inventory: 15 },
      { id: 'v11', productId: 'mock-3', option1: 'Burgundy', option2: null, option3: null, price: 7900, sku: 'ACC-BOW-001-BUR', inventory: 15 }
    ],
    tags: ['accessory', 'bow-tie', 'silk', 'formal'],
    occasions: ['Wedding', 'Gala', 'Formal Event'],
    colorFamily: 'Multi',
    isFeatured: false,
    trendingScore: 72,
    status: 'active'
  },
  {
    id: 'mock-4',
    name: 'Italian Leather Dress Shoes',
    description: 'Handcrafted Italian leather oxford shoes',
    price: 29900, // $299.00 in cents
    compareAtPrice: 39900,
    primaryImage: '/placeholder-product.svg',
    images: ['/placeholder-product.svg'],
    category: 'Footwear',
    productType: 'Shoes',
    brand: 'KCT Footwear',
    sku: 'SHOE-OXF-001',
    inStock: true,
    inventory: 20,
    variants: [
      { id: 'v12', productId: 'mock-4', option1: '9', option2: null, option3: null, price: 29900, sku: 'SHOE-OXF-001-9', inventory: 3 },
      { id: 'v13', productId: 'mock-4', option1: '10', option2: null, option3: null, price: 29900, sku: 'SHOE-OXF-001-10', inventory: 5 },
      { id: 'v14', productId: 'mock-4', option1: '11', option2: null, option3: null, price: 29900, sku: 'SHOE-OXF-001-11', inventory: 7 },
      { id: 'v15', productId: 'mock-4', option1: '12', option2: null, option3: null, price: 29900, sku: 'SHOE-OXF-001-12', inventory: 5 }
    ],
    tags: ['shoes', 'leather', 'formal', 'italian'],
    occasions: ['Business', 'Wedding', 'Formal Event'],
    colorFamily: 'Black',
    isFeatured: false,
    trendingScore: 80,
    status: 'active'
  }
]

export function getMockProducts(page = 1, limit = 50) {
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedProducts = mockProducts.slice(start, end)
  
  return {
    products: paginatedProducts,
    totalCount: mockProducts.length,
    currentPage: page,
    totalPages: Math.ceil(mockProducts.length / limit)
  }
}

export function getMockCategories() {
  return ['Formal Wear', 'Vest & Accessory Sets', 'Footwear', 'Apparel']
}

export function getMockBrands() {
  return ['KCT Premium', 'KCT Executive', 'KCT Accessories', 'KCT Footwear']
}

export function getMockColors() {
  return ['Black', 'Navy', 'Blue', 'Burgundy', 'Multi']
}

export function getMockPriceRange() {
  return { min: 79, max: 599 }
}