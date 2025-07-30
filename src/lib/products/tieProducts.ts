// Tie products configuration with Stripe IDs
export const tieProducts = {
  // Individual tie products by style
  styles: {
    bowtie: {
      name: 'Pre-tied Bow Tie',
      width: 'Adjustable',
      productId: 'prod_SlSC8NMRQDcAAe',
      priceId: 'price_1RpvIMCHc12x7sCzj6ZTx21q',
      price: 24.99,
      description: 'Sophisticated and distinctive, our self-tie bowties are perfect for black-tie events, formal dinners, and special occasions.'
    },
    classic: {
      name: 'Classic',
      width: '3.25 inches',
      productId: 'prod_SlSCPLZUyO8MFe',
      priceId: 'price_1RpvI9CHc12x7sCzE8Q9emhw',
      price: 24.99,
      description: 'Timeless and versatile, the classic width is appropriate for most formal occasions and business settings.'
    },
    skinny: {
      name: 'Skinny',
      width: '2.75 inches',
      productId: 'prod_SlSC1Sy11qUgt1',
      priceId: 'price_1RpvHyCHc12x7sCzjX1WV931',
      price: 24.99,
      description: 'A modern alternative that bridges classic and contemporary styles. Perfect for business-casual settings.'
    },
    slim: {
      name: 'Slim',
      width: '2.25 inches',
      productId: 'prod_SlSC9yAp6lLFm3',
      priceId: 'price_1RpvHlCHc12x7sCzp0TVNS92',
      price: 24.99,
      description: 'Fashion-forward and sleek, the slim tie makes a bold contemporary statement.'
    }
  },

  // Bundle products
  bundles: {
    five: {
      name: '5-Tie Bundle',
      description: 'Buy 4 Get 1 Free',
      productId: 'prod_SlSLsx1Aqf1kYL',
      priceId: 'price_1RpvQqCHc12x7sCzfRrWStZb',
      price: 99.97,
      quantity: 5,
      paidItems: 4,
      savings: 20
    },
    eight: {
      name: '8-Tie Bundle',
      description: 'Buy 6 Get 2 Free',
      productId: 'prod_SlSLxWsdjVPsBS',
      priceId: 'price_1RpvRACHc12x7sCzVYFZh6Ia',
      price: 149.96,
      quantity: 8,
      paidItems: 6,
      savings: 25
    },
    eleven: {
      name: '11-Tie Bundle',
      description: 'Buy 8 Get 3 Free',
      productId: 'prod_SlSMj6NTxWBXMO',
      priceId: 'price_1RpvRSCHc12x7sCzpo0fgH6A',
      price: 199.95,
      quantity: 11,
      paidItems: 8,
      savings: 27
    }
  },

  // Available colors with their image URLs
  colors: [
    {
      id: 'burnt-orange',
      name: 'Burnt Orange',
      displayName: 'Burnt Orange + Bow + Tie',
      hex: '#CC5500',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Burnt%20Orange%20%2B%20Bow%20%2B%20Tie%20.jpg'
    },
    {
      id: 'emerald-green',
      name: 'Emerald Green',
      displayName: 'Emerald Green + Bow + Tie',
      hex: '#50C878',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Emerald%20Green%20%2B%20Bow%20%2B%20Tie.jpg'
    },
    {
      id: 'gold',
      name: 'Gold',
      displayName: 'gold-tie+bowtie',
      hex: '#FFD700',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/gold-tie%2Bbpwtie.jpg'
    },
    {
      id: 'hunter-green',
      name: 'Hunter Green',
      displayName: 'Hunter Green + Bow + Tie',
      hex: '#355E3B',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Hunter%20Green%20%2B%20Bow%20%2B%20Tie.jpg'
    },
    {
      id: 'light-lilac',
      name: 'Light Lilac',
      displayName: 'Light Lilac Bow + Tie',
      hex: '#C8A2C8',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Light%20Lilac%20Bow%20%2B%20Tie.jpg'
    },
    {
      id: 'lilac',
      name: 'Lilac',
      displayName: 'Lillac+bow+tie',
      hex: '#C8A2C8',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Lillac%2Bbow%2Btie.jpg'
    },
    {
      id: 'medium-orange',
      name: 'Medium Orange',
      displayName: 'Medium Orange Bow + Tie',
      hex: '#FF8C00',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Medium%20Orange%20Bow%20%2B%20Tie.jpg'
    },
    {
      id: 'medium-purple',
      name: 'Medium Purple',
      displayName: 'Medium Purple + Bow + Tie',
      hex: '#9370DB',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Medium%20Purple%20%2B%20Bow%20%2B%20Tie.jpg'
    },
    {
      id: 'mermaid-green',
      name: 'Mermaid Green',
      displayName: 'Mermaid Green + Bow + Toe',
      hex: '#3FE0D0',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Mermaid%20Green%20%2B%20Bow%20%2B%20Toe%20.jpg'
    },
    {
      id: 'mint-green',
      name: 'Mint Green',
      displayName: 'Mint Green + Bow + Tie',
      hex: '#98FF98',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Mint%20Green%20%2B%20Bow%20%2B%20Tie.jpg'
    },
    {
      id: 'olive-green',
      name: 'Olive Green',
      displayName: 'Olive Green Bow + Tie',
      hex: '#708238',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Olive%20Green%20Bow%20%2B%20Tie.jpg'
    },
    {
      id: 'orange',
      name: 'Orange',
      displayName: 'Orange Bow + Tie',
      hex: '#FFA500',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Orange%20Bow%20%2B%20Tie.jpg'
    },
    {
      id: 'plum',
      name: 'Plum',
      displayName: 'Plum Color + Bow + Tie',
      hex: '#8E4585',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Plum%20Color%20%2B%20Bow%20%2B%20Tie.jpg'
    },
    {
      id: 'red',
      name: 'Red',
      displayName: 'Red + Bow + Tie',
      hex: '#FF0000',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Red%20%2B%20Bow%20%2B%20Tie.jpg'
    },
    {
      id: 'yellow',
      name: 'Yellow',
      displayName: 'Yellow + Bow + Tie',
      hex: '#FFFF00',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Yellow%20%2B%20Bow%20%2B%20Tie.jpg'
    },
    {
      id: 'dusty-pink',
      name: 'Dusty Pink',
      displayName: 'dustypink',
      hex: '#DCAE96',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/dustypink.jpg'
    },
    {
      id: 'coral',
      name: 'Coral',
      displayName: 'coral',
      hex: '#FF7F50',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/coral.jpg'
    },
    {
      id: 'royal-blue',
      name: 'Royal Blue',
      displayName: 'royal-blue',
      hex: '#4169E1',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/royal-blue.jpg'
    },
    {
      id: 'silver',
      name: 'Silver',
      displayName: 'silver',
      hex: '#C0C0C0',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/silver.jpg'
    },
    {
      id: 'dark-grey',
      name: 'Dark Grey',
      displayName: 'dark-grey',
      hex: '#A9A9A9',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/dark-grey.jpg'
    },
    {
      id: 'blush-pink',
      name: 'Blush Pink',
      displayName: 'blush-pink',
      hex: '#FFE4E1',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/blush-pink.jpg'
    },
    {
      id: 'baby-blue',
      name: 'Baby Blue',
      displayName: 'baby-blue',
      hex: '#89CFF0',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/baby-blue.jpg'
    },
    {
      id: 'dark-red',
      name: 'Dark Red',
      displayName: 'darkred',
      hex: '#8B0000',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/darkred.jpg'
    },
    {
      id: 'dark-navy',
      name: 'Dark Navy',
      displayName: 'Dark Navy',
      hex: '#000080',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Dark%20Navy.jpg'
    },
    {
      id: 'fushia',
      name: 'Fushia',
      displayName: 'fushia',
      hex: '#FF00FF',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/fushia.jpg'
    },
    {
      id: 'pink',
      name: 'Pink',
      displayName: 'pink',
      hex: '#FFC0CB',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/pink.jpg'
    },
    {
      id: 'light-pink',
      name: 'Light Pink',
      displayName: 'light-pink',
      hex: '#FFB6C1',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/light-pink.jpg'
    },
    {
      id: 'black',
      name: 'Black',
      displayName: 'black',
      hex: '#000000',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/black.jpg'
    },
    {
      id: 'white',
      name: 'White',
      displayName: 'white',
      hex: '#FFFFFF',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/white.jpg'
    },
    {
      id: 'blue',
      name: 'Blue',
      displayName: 'blue-',
      hex: '#0000FF',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/blue-.jpg'
    },
    {
      id: 'navy',
      name: 'Navy',
      displayName: 'navy',
      hex: '#000080',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/navy.jpg'
    },
    {
      id: 'burgundy',
      name: 'Burgundy',
      displayName: 'burgundy',
      hex: '#800020',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/burgundy.jpg'
    },
    {
      id: 'powder-blue',
      name: 'Powder Blue',
      displayName: 'powder-blue',
      hex: '#B0E0E6',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/powder-blue.jpg'
    },
    {
      id: 'tiffany-blue',
      name: 'Tiffany Blue',
      displayName: 'Tiffany-Blue',
      hex: '#0ABAB5',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Tiffany-Blue.jpg'
    },
    {
      id: 'moca',
      name: 'Moca',
      displayName: 'moca',
      hex: '#967969',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/moca.jpg'
    }
  ]
};

// Helper function to get color by ID
export function getTieColorById(colorId: string) {
  return tieProducts.colors.find(color => color.id === colorId);
}

// Helper function to get style by ID
export function getTieStyleById(styleId: string) {
  return tieProducts.styles[styleId as keyof typeof tieProducts.styles];
}