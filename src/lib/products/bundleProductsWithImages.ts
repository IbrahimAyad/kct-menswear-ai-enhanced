import { bundleProducts } from './bundleProducts';
import { getSuitImage, getShirtImage, getTieImage } from './bundleImageMapping';

// Create a new bundle products object with all individual images added
export const bundleProductsWithImages = {
  bundles: bundleProducts.bundles.map(bundle => ({
    ...bundle,
    suit: {
      ...bundle.suit,
      image: getSuitImage(bundle.suit.color) || ''
    },
    shirt: {
      ...bundle.shirt,
      image: getShirtImage(bundle.shirt.color) || ''
    },
    tie: {
      ...bundle.tie,
      image: getTieImage(bundle.tie.color) || ''
    }
  }))
};