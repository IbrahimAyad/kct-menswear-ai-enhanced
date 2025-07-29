// Static Stripe product and price IDs
// This file contains only client-safe data - no Stripe SDK initialization

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
      twoPiece: 'price_1Rpv3ZCHc12x7sCzr4qlBV5x', 
      threePiece: 'price_1Rpv3iCHc12x7sCzXWfyYJW0' 
    },
    charcoalGrey: { 
      productId: 'prod_SlRy6SLQKpwQfz', 
      twoPiece: 'price_1Rpv3uCHc12x7sCzOPeVvQ1w', 
      threePiece: 'price_1Rpv41CHc12x7sCzyLxU7cHI' 
    },
    lightGrey: { 
      productId: 'prod_SlRyHCJXMJlqxo', 
      twoPiece: 'price_1Rpv4BCHc12x7sCzGIcJOKTk', 
      threePiece: 'price_1Rpv4KCHc12x7sCzdNJdL02w' 
    },
    tan: { 
      productId: 'prod_SlRyRLJtIYIdyA', 
      twoPiece: 'price_1Rpv4SCHc12x7sCzr2VKKFZI', 
      threePiece: 'price_1Rpv4aCHc12x7sCzQlzlT8Xn' 
    },
    brown: { 
      productId: 'prod_SlRyYQl1s5RVJP', 
      twoPiece: 'price_1Rpv4mCHc12x7sCzSLCOJO7e', 
      threePiece: 'price_1Rpv4vCHc12x7sCz7aHO1Fsa' 
    },
    darkBrown: { 
      productId: 'prod_SlRydJMwdvBUkG', 
      twoPiece: 'price_1Rpv57CHc12x7sCzJq53VvJW', 
      threePiece: 'price_1Rpv5DCHc12x7sCzJFMiGvdJ' 
    },
    burgundy: { 
      productId: 'prod_SlRymQ4V8R4bkm', 
      twoPiece: 'price_1Rpv5OCHc12x7sCzs00h69CU', 
      threePiece: 'price_1Rpv5XCHc12x7sCzSGP5A5Nf' 
    },
    sand: { 
      productId: 'prod_SlRyypASPU3cOA', 
      twoPiece: 'price_1Rpv5hCHc12x7sCzvHsxwrO6', 
      threePiece: 'price_1Rpv5oCHc12x7sCz0AjKWzYN' 
    },
    emerald: { 
      productId: 'prod_SlRz7vOgZRdcYF', 
      twoPiece: 'price_1Rpv61CHc12x7sCzbJxCXi6h', 
      threePiece: 'price_1Rpv68CHc12x7sCzsGpJJrAB' 
    },
    midnightBlue: { 
      productId: 'prod_SlRzE9fW3rNVdh', 
      twoPiece: 'price_1Rpv6ECHc12x7sCzhg4DQz8g', 
      threePiece: 'price_1Rpv6MCHc12x7sCzsClqVBJD' 
    },
    hunterGreen: { 
      productId: 'prod_SlRzMHHbuMKaHV', 
      twoPiece: 'price_1Rpv6VCHc12x7sCzYbF4nYOR', 
      threePiece: 'price_1Rpv6bCHc12x7sCz9f0NnJp9' 
    },
    indigo: { 
      productId: 'prod_SlRzUCPxiGejzx', 
      twoPiece: 'price_1Rpv6jCHc12x7sCz9vKEUkqH', 
      threePiece: 'price_1Rpv6sCHc12x7sCzjOx7FJx8' 
    },
  },
};

// Available sizes for products
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

// Note: Server-side Stripe functions have been moved to API routes
// Use these endpoints instead:
// - POST /api/stripe/products - for fetching products from Stripe
// - POST /api/stripe/checkout - for creating checkout sessions