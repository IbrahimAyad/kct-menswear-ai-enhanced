'use client';

import { MasterCollectionPage } from '@/components/collections/MasterCollectionPage';

// All categories from ShopByStyleGrid
const allCategories = [
  {
    id: 'suits',
    name: 'Suits',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/suits.webp',
    count: 89,
    description: 'Complete suit collections'
  },
  {
    id: 'shirts',
    name: 'Shirts',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/shirts.webp',
    count: 124,
    description: 'Dress shirts and casual shirts'
  },
  {
    id: 'vest',
    name: 'Vest',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/Vest/vest.webp',
    count: 52,
    description: 'Formal and casual vests'
  },
  {
    id: 'jackets',
    name: 'Jackets',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/jackets.webp',
    count: 58,
    description: 'Blazers and sport coats'
  },
  {
    id: 'pants',
    name: 'Pants',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/pants.webp',
    count: 76,
    description: 'Dress pants and trousers'
  },
  {
    id: 'knitwear',
    name: 'Knitwear',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/knitwear.webp',
    count: 45,
    description: 'Sweaters and knit tops'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/accessories.webp',
    count: 93,
    description: 'Ties, belts, and more'
  },
  {
    id: 'shoes',
    name: 'Shoes',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/shoes.webp',
    count: 67,
    description: 'Formal and casual footwear'
  },
  {
    id: 'velvet-blazers',
    name: 'Velvet Blazers',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/velvet-blazer/mens_green_paisley_pattern_velvet_model_1089.webp',
    count: 32,
    description: 'Luxury velvet blazers'
  }
];

// Comprehensive product list combining all categories
const allProducts = [
  // Suits
  {
    id: 'prod-1',
    name: 'Navy Blue Classic Suit',
    price: 389,
    originalPrice: 489,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-suit-white-burgunndy.png',
    category: 'suits',
    tags: ['navy', 'classic', 'business'],
    isSale: true
  },
  {
    id: 'prod-2',
    name: 'Charcoal Grey Business Suit',
    price: 429,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/charcoal-blue-silver.png',
    category: 'suits',
    tags: ['grey', 'business', 'formal'],
    isNew: true
  },
  
  // Shirts
  {
    id: 'prod-3',
    name: 'White Classic Dress Shirt',
    price: 89,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/White-Dress-Shirt.jpg',
    category: 'shirts',
    tags: ['white', 'dress', 'formal']
  },
  {
    id: 'prod-4',
    name: 'Light Blue Oxford Shirt',
    price: 79,
    originalPrice: 99,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Light-Blue-Dress-Shirt.jpg',
    category: 'shirts',
    tags: ['blue', 'oxford', 'casual'],
    isSale: true
  },
  {
    id: 'prod-5',
    name: 'Pink Business Shirt',
    price: 85,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Light%20Pink-Dress-Shirt.jpg',
    category: 'shirts',
    tags: ['pink', 'business', 'formal']
  },
  
  // Vests
  {
    id: 'prod-6',
    name: 'Navy Formal Vest',
    price: 129,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/Vest/vest.webp',
    category: 'vest',
    tags: ['navy', 'formal', 'wedding'],
    isNew: true
  },
  {
    id: 'prod-7',
    name: 'Grey Wool Vest',
    price: 119,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/Vest/grey-vest.webp',
    category: 'vest',
    tags: ['grey', 'wool', 'business']
  },
  
  // Jackets
  {
    id: 'prod-8',
    name: 'Navy Blazer',
    price: 249,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/jackets.webp',
    category: 'jackets',
    tags: ['navy', 'blazer', 'versatile']
  },
  {
    id: 'prod-9',
    name: 'Tweed Sport Coat',
    price: 279,
    originalPrice: 349,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/tweed-jacket.webp',
    category: 'jackets',
    tags: ['tweed', 'sport', 'casual'],
    isSale: true
  },
  
  // Pants
  {
    id: 'prod-10',
    name: 'Navy Dress Trousers',
    price: 149,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/pants.webp',
    category: 'pants',
    tags: ['navy', 'dress', 'formal']
  },
  {
    id: 'prod-11',
    name: 'Grey Wool Pants',
    price: 159,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/grey-pants.webp',
    category: 'pants',
    tags: ['grey', 'wool', 'business']
  },
  
  // Knitwear
  {
    id: 'prod-12',
    name: 'Navy Merino Sweater',
    price: 169,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/knitwear.webp',
    category: 'knitwear',
    tags: ['merino', 'navy', 'luxury'],
    isNew: true
  },
  {
    id: 'prod-13',
    name: 'Black Turtleneck',
    price: 139,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/black-turtleneck.webp',
    category: 'knitwear',
    tags: ['black', 'turtleneck', 'modern']
  },
  
  // Accessories
  {
    id: 'prod-14',
    name: 'Burgundy Silk Tie',
    price: 49,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/burgundy.jpg',
    category: 'accessories',
    tags: ['burgundy', 'silk', 'tie']
  },
  {
    id: 'prod-15',
    name: 'Silver Tie',
    price: 45,
    originalPrice: 59,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/silver.jpg',
    category: 'accessories',
    tags: ['silver', 'formal', 'tie'],
    isSale: true
  },
  {
    id: 'prod-16',
    name: 'Navy Bow Tie',
    price: 39,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/navy.jpg',
    category: 'accessories',
    tags: ['navy', 'bowtie', 'formal']
  },
  
  // Shoes
  {
    id: 'prod-17',
    name: 'Black Oxford Shoes',
    price: 249,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/shoes.webp',
    category: 'shoes',
    tags: ['oxford', 'black', 'formal']
  },
  {
    id: 'prod-18',
    name: 'Brown Leather Loafers',
    price: 229,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/brown-loafers.webp',
    category: 'shoes',
    tags: ['loafers', 'brown', 'casual']
  },
  
  // Velvet Blazers
  {
    id: 'prod-19',
    name: 'Emerald Velvet Blazer',
    price: 399,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/velvet-blazer/mens_green_paisley_pattern_velvet_model_1089.webp',
    category: 'velvet-blazers',
    tags: ['velvet', 'green', 'luxury'],
    isNew: true
  },
  {
    id: 'prod-20',
    name: 'Burgundy Velvet Jacket',
    price: 379,
    originalPrice: 449,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/velvet-blazer/burgundy-velvet.webp',
    category: 'velvet-blazers',
    tags: ['velvet', 'burgundy', 'formal'],
    isSale: true
  },
  
  // More products...
  {
    id: 'prod-21',
    name: 'Black Formal Suit',
    price: 399,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-black.png',
    category: 'suits',
    tags: ['black', 'formal', 'evening']
  },
  {
    id: 'prod-22',
    name: 'Lilac Dress Shirt',
    price: 75,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Lilac-Dress-Shirt.jpg',
    category: 'shirts',
    tags: ['lilac', 'dress', 'spring']
  },
  {
    id: 'prod-23',
    name: 'Black Dress Shirt',
    price: 85,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Black-Dress-Shirt.jpg',
    category: 'shirts',
    tags: ['black', 'dress', 'evening']
  },
  {
    id: 'prod-24',
    name: 'Red Power Tie',
    price: 55,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/red.jpg',
    category: 'accessories',
    tags: ['red', 'power', 'tie']
  }
];

export default function CollectionsPage() {
  return (
    <MasterCollectionPage
      title="Master Collection"
      subtitle="COMPLETE MENSWEAR"
      description="Precision-tailored pieces in timeless colors enhance every part of a man's wardrobe."
      categories={allCategories}
      products={allProducts}
      heroImage="https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/hero-collection.webp"
    />
  );
}