import { useCartStore } from '@/lib/store/cartStore';
import { Product, ProductCategory } from '@/lib/types';

interface CartItemData {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stripePriceId: string;
  stripeProductId?: string;
  selectedColor?: string;
  selectedSize?: string;
  category?: string;
  bundleId?: string;
  metadata?: Record<string, any>;
}

export function useCart() {
  const store = useCartStore();

  const addItem = (item: CartItemData) => {
    // Convert to Product format expected by cart store
    const product: Product = {
      id: item.id,
      sku: item.id, // Use id as sku fallback
      name: item.name,
      price: item.price,
      images: [item.image],
      category: (item.category as ProductCategory) || 'accessories',
      stock: {}, // Empty stock object, will be handled by inventory system
      variants: [], // Empty variants array, size handled separately
      color: item.selectedColor,
      description: undefined,
      metadata: {
        ...item.metadata,
        stripePriceId: item.stripePriceId,
        stripeProductId: item.stripeProductId,
        category: item.category,
        bundleId: item.bundleId,
      }
    };

    store.addItem(product, item.selectedSize || '', item.quantity);
  };

  return {
    items: store.items,
    addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    getTotalItems: store.getTotalItems,
    getTotalPrice: store.getTotalPrice
  };
}