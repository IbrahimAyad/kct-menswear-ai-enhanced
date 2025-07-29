import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Product } from "@/lib/types";
import { adminClient } from "@/lib/api/adminClient";

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  addItem: (product: Product, size: string, quantity?: number) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: (products: Product[]) => number;
  syncCart: (customerId: string) => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (product: Product, size: string, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.id && item.size === size
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id && item.size === size
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                quantity,
                size,
                // Store additional product data
                name: product.name,
                price: product.price,
                image: product.images?.[0],
                metadata: product.metadata,
              } as CartItem,
            ],
          };
        });
      },

      removeItem: (productId: string, size: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.size === size)
          ),
        }));
      },

      updateQuantity: (productId: string, size: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: (products: Product[]) => {
        const { items } = get();
        return items.reduce((total, item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return total;
          
          const variant = product.variants.find((v) => v.size === item.size);
          const price = variant?.price || product.price;
          
          return total + price * item.quantity;
        }, 0);
      },

      syncCart: async (customerId: string) => {
        if (!customerId) return;
        
        set({ isLoading: true });
        try {
          const { items } = get();
          
          // Sync each item with the server
          for (const item of items) {
            await adminClient.updateCart(customerId, item);
          }
          
          // Fetch the latest cart from server
          const serverCart = await adminClient.getCart(customerId);
          set({ items: serverCart });
        } catch (error) {
          console.error("Failed to sync cart:", error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "kct-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);