import { useCartStore } from '@/lib/store/cartStore';

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
    const product = {
      id: item.id,
      name: item.name,
      price: item.price,
      images: [item.image],
      stripePriceId: item.stripePriceId,
      stripeProductId: item.stripeProductId,
      category: item.category || 'ties',
      color: item.selectedColor,
      bundleId: item.bundleId,
      metadata: {
        ...item.metadata,
        stripePriceId: item.stripePriceId,
        stripeProductId: item.stripeProductId,
        category: item.category,
      }
    } as any;
    
    console.log('Adding to cart:', {
      name: item.name,
      stripePriceId: item.stripePriceId,
      category: item.category,
      metadata: product.metadata
    });

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