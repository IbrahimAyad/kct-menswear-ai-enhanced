// Cart persistence utilities
const CART_STORAGE_KEY = 'kct-cart';
const CART_EXPIRY_DAYS = 30;

export interface PersistedCart {
  items: any[];
  updatedAt: string;
  expiresAt: string;
}

export function saveCartToStorage(items: any[]) {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    const persistedCart: PersistedCart = {
      items,
      updatedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(persistedCart));
  } catch (error) {

  }
}

export function loadCartFromStorage(): any[] | null {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return null;

    const persistedCart: PersistedCart = JSON.parse(stored);
    const now = new Date();
    const expiresAt = new Date(persistedCart.expiresAt);

    // Check if cart has expired
    if (now > expiresAt) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return null;
    }

    return persistedCart.items;
  } catch (error) {

    return null;
  }
}

export function clearCartStorage() {
  localStorage.removeItem(CART_STORAGE_KEY);
}