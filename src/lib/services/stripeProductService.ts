import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export const stripeProducts = {
  suits: {
    navy: { 
      productId: 'prod_SlQuqaI2IR6FRm', 
      twoPiece: 'price_1Rpv2tCHc12x7sCzVvLRto3m', 
      threePiece: 'price_1Rpv31CHc12x7sCzlFtlUflr' 
    },
    beige: { 
      productId: 'prod_SlRx1FInciqpks', 
      twoPiece: 'price_1Rpv3FCHc12x7sCzg9nHaXkM', 
      threePiece: 'price_1Rpv3QCHc12x7sCzMVTfaqEE' 
    },
    black: { 
      productId: 'prod_SlRxbBl5ZnnoDy', 
      twoPiece: 'price_1Rpv3cCHc12x7sCzLtiatn73', 
      threePiece: 'price_1Rpv3iCHc12x7sCzJYg14SL8' 
    },
    brown: { 
      productId: 'prod_SlRxCr1EySVGFB', 
      twoPiece: 'price_1Rpv3zCHc12x7sCzKMSpA4hP', 
      threePiece: 'price_1Rpv4ECHc12x7sCzhUuL9uCE' 
    },
    burgundy: { 
      productId: 'prod_SlRyyerfBI04Gd', 
      twoPiece: 'price_1Rpv4XCHc12x7sCzSC3Mbtey', 
      threePiece: 'price_1Rpv4eCHc12x7sCzwbuknObE' 
    },
    charcoalGrey: { 
      productId: 'prod_SlRy7hTZZH1SA3', 
      twoPiece: 'price_1Rpv4sCHc12x7sCzgMUu7hLq', 
      threePiece: 'price_1Rpv4zCHc12x7sCzerWp2R07' 
    },
    darkBrown: { 
      productId: 'prod_SlRzSHXkrMqRAz', 
      twoPiece: 'price_1Rpv5DCHc12x7sCzdWjcaCY4', 
      threePiece: 'price_1Rpv5JCHc12x7sCzPd619lQ8' 
    },
    emerald: { 
      productId: 'prod_SlRzjrSQicROMU', 
      twoPiece: 'price_1Rpv5XCHc12x7sCzzP57OQvP', 
      threePiece: 'price_1Rpv5eCHc12x7sCzIAVMbB7m' 
    },
    hunterGreen: { 
      productId: 'prod_SlRzUC4Qc8DB6A', 
      twoPiece: 'price_1Rpv5vCHc12x7sCzAlFuGQNL', 
      threePiece: 'price_1Rpv61CHc12x7sCzIboI1eC8' 
    },
    indigo: { 
      productId: 'prod_SlS04B64q1VSDL', 
      twoPiece: 'price_1Rpv6ECHc12x7sCz7JjWOP0p', 
      threePiece: 'price_1Rpv6KCHc12x7sCzzaFWFxef' 
    },
    lightGrey: { 
      productId: 'prod_SlS0s1WVSYRMpA', 
      twoPiece: 'price_1Rpv6WCHc12x7sCzDJI7Ypav', 
      threePiece: 'price_1Rpv6dCHc12x7sCz3JOmrvuA' 
    },
    midnightBlue: { 
      productId: 'prod_SlS0Q2HVvKSrro', 
      twoPiece: 'price_1Rpv6sCHc12x7sCz6OZIkTR2', 
      threePiece: 'price_1Rpv6yCHc12x7sCz1LFaN5gS' 
    },
    sand: { 
      productId: 'prod_SlS17gP6o4ORY9', 
      twoPiece: 'price_1Rpv7GCHc12x7sCzV9qUCc7I', 
      threePiece: 'price_1Rpv7PCHc12x7sCzbXQ9a1MG' 
    },
    tan: { 
      productId: 'prod_SlS1G2jUIjPQXv', 
      twoPiece: 'price_1Rpv7dCHc12x7sCzoWrXk2Ot', 
      threePiece: 'price_1Rpv7mCHc12x7sCzixeUm5ep' 
    },
  },
  ties: {
    ultraSkinny: { productId: 'prod_SlSC9yAp6lLFm3', priceId: 'price_1RpvHlCHc12x7sCzp0TVNS92' },
    skinny: { productId: 'prod_SlSC1Sy11qUgt1', priceId: 'price_1RpvHyCHc12x7sCzjX1WV931' },
    classic: { productId: 'prod_SlSCPLZUyO8MFe', priceId: 'price_1RpvI9CHc12x7sCzE8Q9emhw' },
    bowTie: { productId: 'prod_SlSC8NMRQDcAAe', priceId: 'price_1RpvIMCHc12x7sCzj6ZTx21q' },
  },
  tieBundles: {
    five: { productId: 'prod_SlSLsx1Aqf1kYL', priceId: 'price_1RpvQqCHc12x7sCzfRrWStZb', price: 99.97 },
    eight: { productId: 'prod_SlSLxWsdjVPsBS', priceId: 'price_1RpvRACHc12x7sCzVYFZh6Ia', price: 149.96 },
    eleven: { productId: 'prod_SlSMj6NTxWBXMO', priceId: 'price_1RpvRSCHc12x7sCzpo0fgH6A', price: 199.95 },
  },
  shirts: {
    slimCut: { productId: 'prod_SlSRMPGpXou00R', priceId: 'price_1RpvWnCHc12x7sCzzioA64qD' },
    classicFit: { productId: 'prod_SlSRbnQ86MqArC', priceId: 'price_1RpvXACHc12x7sCz2Ngkmp64' },
  },
  outfitBundles: {
    starter: { productId: 'prod_SlSZmQA5LwUhO1', priceId: 'price_1RpveuCHc12x7sCzymNhst5U', price: 199.00 },
    professional: { productId: 'prod_SlSaykTFjIHuWY', priceId: 'price_1RpvfGCHc12x7sCz7Is4hRPt', price: 229.99 },
    executive: { productId: 'prod_SlSajVeOT9lcAp', priceId: 'price_1RpvfbCHc12x7sCzULHk0jBm', price: 249.99 },
    premium: { productId: 'prod_SlSadPRSclMs0J', priceId: 'price_1RpvfvCHc12x7sCzq1jYfG9o', price: 299.99 },
  },
};

// Available sizes for different product types
export const availableSizes = {
  suits: [
    '34S', '34R',
    '36S', '36R',
    '38S', '38R', '38L',
    '40S', '40R', '40L',
    '42S', '42R', '42L',
    '44S', '44R', '44L',
    '46S', '46R', '46L',
    '48S', '48R', '48L',
    '50S', '50R', '50L',
    '52R', '52L',
    '54R', '54L'
  ],
  shirts: ['14.5', '15', '15.5', '16', '16.5', '17', '17.5', '18'],
};

// Available tie colors
export const tieColors = {
  blues: ['Navy Blue', 'Royal Blue', 'Tiffany Blue', 'Sky Blue', 'Steel Blue', 'Powder Blue', 'Midnight Blue', 'Cornflower Blue', 'Periwinkle', 'Cerulean', 'Cobalt Blue', 'Electric Blue', 'Sapphire', 'Turquoise', 'Aquamarine', 'Cadet Blue', 'Slate Blue', 'Dodger Blue'],
  reds: ['Crimson Red', 'Wine Red', 'Cherry Red', 'Burgundy', 'Coral Red', 'Rose Red', 'Maroon', 'Scarlet', 'Ruby Red', 'Brick Red', 'Fire Engine Red', 'Cardinal Red'],
  greens: ['Forest Green', 'Emerald Green', 'Sage Green', 'Mint Green', 'Hunter Green', 'Olive Green', 'Sea Green', 'Lime Green', 'Pine Green', 'Kelly Green'],
  purples: ['Royal Purple', 'Lavender', 'Violet', 'Plum', 'Amethyst', 'Eggplant', 'Mauve', 'Orchid'],
  yellowsGolds: ['Golden Yellow', 'Mustard Yellow', 'Lemon Yellow', 'Champagne', 'Amber', 'Canary Yellow', 'Saffron', 'Honey'],
  oranges: ['Burnt Orange', 'Tangerine', 'Peach', 'Copper', 'Rust', 'Apricot'],
  pinks: ['Blush Pink', 'Rose Pink', 'Dusty Rose', 'Hot Pink', 'Salmon Pink', 'Magenta'],
  neutrals: ['Charcoal Gray', 'Silver Gray', 'Champagne Beige', 'Taupe', 'Cream', 'Ivory', 'Platinum', 'Pearl'],
};

export async function fetchStripeProducts() {
  try {
    const products = await stripe.products.list({
      active: true,
      limit: 100,
      expand: ['data.default_price']
    });
    
    return products.data;
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    throw error;
  }
}

export async function fetchProductPrices(productId: string) {
  try {
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      expand: ['data.product']
    });
    
    return prices.data;
  } catch (error) {
    console.error('Error fetching product prices:', error);
    throw error;
  }
}

// Transform Stripe product to match frontend structure
export function transformStripeProduct(stripeProduct: Stripe.Product, prices?: Stripe.Price[]) {
  const defaultPrice = stripeProduct.default_price as Stripe.Price;
  const metadata = stripeProduct.metadata || {};
  
  return {
    id: stripeProduct.id,
    name: stripeProduct.name,
    description: stripeProduct.description || '',
    images: stripeProduct.images,
    category: metadata.category || 'uncategorized',
    subcategory: metadata.subcategory || '',
    stripePriceId: defaultPrice?.id || prices?.[0]?.id || '',
    price: defaultPrice?.unit_amount ? defaultPrice.unit_amount / 100 : 0,
    prices: prices?.map(p => ({
      id: p.id,
      nickname: p.nickname || '',
      amount: (p.unit_amount || 0) / 100,
    })) || [],
    availableColors: metadata.available_colors ? JSON.parse(metadata.available_colors) : [],
    availableSizes: metadata.available_sizes ? JSON.parse(metadata.available_sizes) : [],
    metadata: metadata,
  };
}