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
    },
    // New colors added
    {
      id: 'champagne',
      name: 'Champagne',
      displayName: 'Champagne',
      hex: '#F7E7CE',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Champagne-main.png'
    },
    {
      id: 'deep-purple',
      name: 'Deep Purple',
      displayName: 'Deep-Purple',
      hex: '#663399',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Deep-Purple-main.png'
    },
    {
      id: 'ivory',
      name: 'Ivory',
      displayName: 'Ivory',
      hex: '#FFFFF0',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Ivory-Main.png'
    },
    {
      id: 'lettuce-green',
      name: 'Lettuce Green',
      displayName: 'Lettuce-Green',
      hex: '#A8E4A0',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Lettuce-Green.webp'
    },
    {
      id: 'apple-red',
      name: 'Apple Red',
      displayName: 'Apple-Red',
      hex: '#FF4040',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Apple-Red-main.webp'
    },
    {
      id: 'banana-yellow',
      name: 'Banana Yellow',
      displayName: 'Banana-Yellow',
      hex: '#FFE135',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Banana-Yellow-main.webp'
    },
    {
      id: 'beige',
      name: 'Beige',
      displayName: 'Beige',
      hex: '#F5F5DC',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Beige-main.webp'
    },
    {
      id: 'canary',
      name: 'Canary',
      displayName: 'Canary',
      hex: '#FFFF99',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Canary-main.webp'
    },
    {
      id: 'carolina-blue',
      name: 'Carolina Blue',
      displayName: 'Carolina-Blue',
      hex: '#99BADD',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Carolina-Blue-main.webp'
    },
    {
      id: 'charcoal',
      name: 'Charcoal',
      displayName: 'Charcoal',
      hex: '#36454F',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Charcoal-main.webp'
    },
    {
      id: 'chianti',
      name: 'Chianti',
      displayName: 'Chianti',
      hex: '#B94E48',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Chianti-main.webp'
    },
    {
      id: 'chocolate-brown',
      name: 'Chocolate Brown',
      displayName: 'Chocolate-Brown',
      hex: '#7B3F00',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Chocolate-Brown-main.webp'
    },
    {
      id: 'cobalt',
      name: 'Cobalt',
      displayName: 'Cobalt',
      hex: '#0047AB',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Cobalt-main.webp'
    },
    {
      id: 'dark-olive',
      name: 'Dark Olive',
      displayName: 'Dark-Olive',
      hex: '#556B2F',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Dark-Olive-main.webp'
    },
    {
      id: 'denim-blue',
      name: 'Denim Blue',
      displayName: 'Denim-Blue',
      hex: '#1560BD',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Denim-Blue-main.webp'
    },
    {
      id: 'dusty-sage',
      name: 'Dusty Sage',
      displayName: 'Dusty-Sage',
      hex: '#9CAF88',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Dusty-Sage-main.webp'
    },
    {
      id: 'french-rose',
      name: 'French Rose',
      displayName: 'French-Rose',
      hex: '#F64A8A',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/French-Rose.webp'
    },
    {
      id: 'light-blush',
      name: 'Light Blush',
      displayName: 'Light-Blush',
      hex: '#FFE4E1',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Light-Blush-main.webp'
    },
    {
      id: 'magenta',
      name: 'Magenta',
      displayName: 'Magenta',
      hex: '#FF00FF',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Magenta-main.webp'
    },
    {
      id: 'mauve',
      name: 'Mauve',
      displayName: 'Mauve',
      hex: '#E0B0FF',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Mauve-main.webp'
    },
    {
      id: 'medium-brown',
      name: 'Medium Brown',
      displayName: 'Medium-Brown',
      hex: '#8B4513',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Medium-Brown.webp'
    },
    {
      id: 'nutmeg',
      name: 'Nutmeg',
      displayName: 'Nutmeg',
      hex: '#8B6F47',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Nutmeg-main.webp'
    },
    {
      id: 'pastel-green',
      name: 'Pastel Green',
      displayName: 'Pastel-Green',
      hex: '#77DD77',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Pastel-Green-main.webp'
    },
    {
      id: 'pastel-purple',
      name: 'Pastel Purple',
      displayName: 'Pastel-Purple',
      hex: '#B19CD9',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Pastel-Purple-main.webp'
    },
    {
      id: 'peach',
      name: 'Peach',
      displayName: 'Peach',
      hex: '#FFE5B4',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Peach-main.webp'
    },
    {
      id: 'rose-gold',
      name: 'Rose Gold',
      displayName: 'Rose-Gold',
      hex: '#B76E79',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Rose-Gold-main.webp'
    },
    {
      id: 'salmon-orange',
      name: 'Salmon Orange',
      displayName: 'Salmon-Orange',
      hex: '#FF8C69',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Salmon-Orange.webp'
    },
    {
      id: 'sapphire-blue',
      name: 'Sapphire Blue',
      displayName: 'Sapphire-Blue',
      hex: '#0F52BA',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Sapphire-Blue-main.webp'
    },
    {
      id: 'taupe',
      name: 'Taupe',
      displayName: 'Taupe',
      hex: '#483C32',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Taupe-main.webp'
    },
    {
      id: 'teal',
      name: 'Teal',
      displayName: 'Teal',
      hex: '#008080',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Teal-main.webp'
    },
    {
      id: 'aqua',
      name: 'Aqua',
      displayName: 'Aqua',
      hex: '#00FFFF',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/aqua-main.webp'
    },
    {
      id: 'dark-silver',
      name: 'Dark Silver',
      displayName: 'Dark-Silver',
      hex: '#71706E',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/dark-silver-main.webp'
    },
    {
      id: 'true-red',
      name: 'True Red',
      displayName: 'True-Red',
      hex: '#FF0000',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/True-Red-main.webp'
    },
    {
      id: 'turquoise',
      name: 'Turquoise',
      displayName: 'Turquoise',
      hex: '#40E0D0',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Turquoise-main.webp'
    },
    {
      id: 'french-blue',
      name: 'French Blue',
      displayName: 'French-Blue',
      hex: '#0072BB',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/french-blue-main.webp'
    },
    {
      id: 'lime',
      name: 'Lime',
      displayName: 'Lime',
      hex: '#BFFF00',
      imageUrl: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/lime-main.webp'
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