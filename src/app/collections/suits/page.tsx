'use client';

import { MasterCollectionPage } from '@/components/collections/MasterCollectionPage';

// Categories based on your ShopByStyleGrid
const suitCategories = [
  {
    id: 'classic',
    name: 'Classic Suits',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/classic-suits.webp',
    count: 89,
    description: 'Timeless two-piece and three-piece suits'
  },
  {
    id: 'summer',
    name: 'Summer Suits',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/summer-suits.webp',
    count: 45,
    description: 'Lightweight fabrics for warm weather'
  },
  {
    id: 'perennial',
    name: 'Perennial Suits',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/year-round-suits.webp',
    count: 76,
    description: 'Year-round versatile options'
  },
  {
    id: 'wedding',
    name: 'Wedding Suits',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/wedding-suits.webp',
    count: 52,
    description: 'Elegant suits for special occasions'
  },
  {
    id: 'luxury',
    name: 'Luxury Suits',
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/luxury-suits.webp',
    count: 38,
    description: 'Premium fabrics and craftsmanship'
  }
];

// Sample products with real KCT images
const suitProducts = [
  // Classic Suits
  {
    id: 'suit-1',
    name: 'Navy Blue Classic Suit',
    price: 389,
    originalPrice: 489,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-suit-white-burgunndy.png',
    hoverImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-3p-white-red.png',
    category: 'classic',
    tags: ['navy', 'classic', 'business'],
    isSale: true
  },
  {
    id: 'suit-2',
    name: 'Charcoal Grey Business Suit',
    price: 429,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/charcoal-blue-silver.png',
    category: 'classic',
    tags: ['grey', 'business', 'formal'],
    isNew: true
  },
  {
    id: 'suit-3',
    name: 'Black Formal Suit',
    price: 399,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-black.png',
    category: 'classic',
    tags: ['black', 'formal', 'evening']
  },
  {
    id: 'suit-4',
    name: 'Light Grey Professional',
    price: 379,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/grey-pink-navy.png',
    category: 'classic',
    tags: ['grey', 'light', 'business']
  },
  
  // Summer Suits
  {
    id: 'suit-5',
    name: 'Linen Beige Summer Suit',
    price: 349,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/beige-white-blue.png',
    category: 'summer',
    tags: ['linen', 'beige', 'summer'],
    isNew: true
  },
  {
    id: 'suit-6',
    name: 'Light Blue Cotton Suit',
    price: 329,
    originalPrice: 399,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/light-blue-white-navy.png',
    category: 'summer',
    tags: ['cotton', 'blue', 'casual'],
    isSale: true
  },
  {
    id: 'suit-7',
    name: 'Stone Lightweight Suit',
    price: 359,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/stone-light-blue-brown.png',
    category: 'summer',
    tags: ['stone', 'lightweight', 'breathable']
  },
  
  // Wedding Suits
  {
    id: 'suit-8',
    name: 'Midnight Blue Tuxedo',
    price: 599,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/midnight-blue-tux.png',
    category: 'wedding',
    tags: ['tuxedo', 'formal', 'wedding'],
    isNew: true
  },
  {
    id: 'suit-9',
    name: 'Ivory Wedding Suit',
    price: 549,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/ivory-wedding.png',
    category: 'wedding',
    tags: ['ivory', 'wedding', 'groom']
  },
  {
    id: 'suit-10',
    name: 'Silver Grey Formal',
    price: 479,
    originalPrice: 579,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/silver-grey-formal.png',
    category: 'wedding',
    tags: ['silver', 'formal', 'wedding'],
    isSale: true
  },
  
  // Perennial Suits
  {
    id: 'suit-11',
    name: 'Navy Wool Blend',
    price: 449,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-wool-blend.png',
    category: 'perennial',
    tags: ['wool', 'navy', 'versatile']
  },
  {
    id: 'suit-12',
    name: 'Charcoal All-Season',
    price: 469,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/charcoal-all-season.png',
    category: 'perennial',
    tags: ['charcoal', 'wool', 'year-round']
  },
  {
    id: 'suit-13',
    name: 'Medium Grey Worsted',
    price: 439,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/medium-grey-worsted.png',
    category: 'perennial',
    tags: ['grey', 'worsted', 'business']
  },
  
  // Luxury Suits
  {
    id: 'suit-14',
    name: 'Italian Merino Navy',
    price: 899,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/italian-merino-navy.png',
    category: 'luxury',
    tags: ['merino', 'italian', 'luxury'],
    isNew: true
  },
  {
    id: 'suit-15',
    name: 'Cashmere Blend Charcoal',
    price: 1099,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/cashmere-charcoal.png',
    category: 'luxury',
    tags: ['cashmere', 'premium', 'charcoal']
  },
  {
    id: 'suit-16',
    name: 'Super 150s Black',
    price: 799,
    originalPrice: 999,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/super-150-black.png',
    category: 'luxury',
    tags: ['super150s', 'black', 'luxury'],
    isSale: true
  },
  
  // More Classic Suits
  {
    id: 'suit-17',
    name: 'Brown Tweed Heritage',
    price: 459,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/brown-tweed.png',
    category: 'classic',
    tags: ['tweed', 'brown', 'heritage']
  },
  {
    id: 'suit-18',
    name: 'Blue Pinstripe Classic',
    price: 489,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/blue-pinstripe.png',
    category: 'classic',
    tags: ['pinstripe', 'blue', 'business']
  },
  
  // More Summer Suits
  {
    id: 'suit-19',
    name: 'Khaki Cotton Casual',
    price: 299,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/khaki-cotton.png',
    category: 'summer',
    tags: ['khaki', 'cotton', 'casual']
  },
  {
    id: 'suit-20',
    name: 'Sky Blue Linen',
    price: 369,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/sky-blue-linen.png',
    category: 'summer',
    tags: ['linen', 'sky-blue', 'summer']
  }
];

export default function SuitsCollectionPage() {
  return (
    <MasterCollectionPage
      title="Suits for Men"
      subtitle="MASTER COLLECTION"
      description="A well-tailored suit remains the defining element of a truly complete wardrobe."
      categories={suitCategories}
      products={suitProducts}
      heroImage="https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/classic-suits.webp"
    />
  );
}