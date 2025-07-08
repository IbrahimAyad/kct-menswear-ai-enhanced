import { useEffect, useCallback } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useProductStore } from "@/lib/store/productStore";
import { Product } from "@/lib/types";
import { useNotifications } from "./useNotifications";
import { useTrackCart } from "@/lib/analytics/hooks/useAnalytics";

export function useCart() {
  const {
    items,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    syncCart,
  } = useCartStore();

  const { customer } = useAuthStore();
  const { products } = useProductStore();
  const { notifySuccess, notifyError, notifyWarning } = useNotifications();
  const { trackAddToCart, trackRemoveFromCart } = useTrackCart();

  // Sync cart with server when customer logs in
  useEffect(() => {
    if (customer?.id) {
      syncCart(customer.id);
    }
  }, [customer?.id]);

  const handleAddToCart = useCallback(
    (product: Product, size: string, quantity = 1) => {
      try {
        // Check if size is in stock
        const variant = product.variants.find((v) => v.size === size);
        if (!variant || variant.stock < quantity) {
          notifyError("Out of Stock", `${product.name} in size ${size} is not available`);
          return;
        }

        addItem(product, size, quantity);
        notifySuccess("Added to Cart", `${product.name} (${size}) added to your cart`);
        
        // Track analytics
        trackAddToCart({
          productId: product.id,
          productName: product.name,
          category: product.category,
          price: product.price,
          quantity,
          size,
        });

        // Sync with server if logged in
        if (customer?.id) {
          syncCart(customer.id);
        }
      } catch (error) {
        notifyError("Error", "Failed to add item to cart");
        console.error("Add to cart error:", error);
      }
    },
    [customer?.id, addItem, syncCart, notifySuccess, notifyError, trackAddToCart]
  );

  const handleRemoveFromCart = useCallback(
    (productId: string, size: string) => {
      const product = products.find((p) => p.id === productId);
      const item = items.find((i) => i.productId === productId && i.size === size);
      
      if (product && item) {
        // Track analytics before removing
        trackRemoveFromCart({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: item.quantity,
          size,
        });
      }
      
      removeItem(productId, size);

      // Sync with server if logged in
      if (customer?.id) {
        syncCart(customer.id);
      }
    },
    [customer?.id, products, items, removeItem, syncCart, trackRemoveFromCart]
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      try {
        // Check stock before updating
        const product = products.find((p) => p.id === productId);
        if (product) {
          const variant = product.variants.find((v) => v.size === size);
          if (!variant || variant.stock < quantity) {
            notifyWarning("Limited Stock", `Only ${variant?.stock || 0} items available`);
            return;
          }
        }

        updateQuantity(productId, size, quantity);

        // Sync with server if logged in
        if (customer?.id) {
          syncCart(customer.id);
        }
      } catch (error) {
        notifyError("Error", "Failed to update quantity");
        console.error("Update quantity error:", error);
      }
    },
    [customer?.id, products, updateQuantity, syncCart, notifyWarning, notifyError]
  );

  const cartSummary = {
    itemCount: getTotalItems(),
    totalPrice: getTotalPrice(products),
  };

  return {
    items,
    isLoading,
    cartSummary,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart,
  };
}

export function useCartItem(productId: string) {
  const { items } = useCartStore();
  const { products } = useProductStore();

  const cartItems = items.filter((item) => item.productId === productId);
  const product = products.find((p) => p.id === productId);

  const isInCart = cartItems.length > 0;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    isInCart,
    cartItems,
    totalQuantity,
    product,
  };
}