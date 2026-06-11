// ================================================
// JARDINIA FRANCE - Store Panier (Zustand)
// ================================================
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductVariant } from "@/types";
import { calculateShipping } from "@/lib/utils";

interface LocalCartItem {
  id: string; // productId[-variantId]
  productId: string;
  variantId: string | null;
  quantity: number;
  product: Product;
  variant: ProductVariant | null;
}

interface CartStore {
  items: LocalCartItem[];
  couponCode: string | null;
  discount: number;
  shippingMethod: "standard" | "express";

  // Computed
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  total: number;

  // Actions
  addItem: (product: Product, variant?: ProductVariant | null, qty?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  setShippingMethod: (method: "standard" | "express") => void;
}

function makeItemId(productId: string, variantId: string | null) {
  return variantId ? `${productId}-${variantId}` : productId;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discount: 0,
      shippingMethod: "standard",

      get itemCount() {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      get subtotal() {
        return get().items.reduce((acc, item) => {
          const price =
            item.variant?.price !== null && item.variant?.price !== undefined
              ? item.product.price + item.variant.price
              : item.product.price;
          return acc + price * item.quantity;
        }, 0);
      },

      get shippingCost() {
        return calculateShipping(get().subtotal, get().shippingMethod);
      },

      get total() {
        const s = get();
        return Math.max(0, s.subtotal + s.shippingCost - s.discount);
      },

      addItem(product, variant = null, qty = 1) {
        const itemId = makeItemId(product.id, variant?.id ?? null);
        set((state) => {
          const existing = state.items.find((i) => i.id === itemId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === itemId
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: itemId,
                productId: product.id,
                variantId: variant?.id ?? null,
                quantity: qty,
                product,
                variant: variant ?? null,
              },
            ],
          };
        });
      },

      removeItem(itemId) {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },

      updateQuantity(itemId, quantity) {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart() {
        set({ items: [], couponCode: null, discount: 0 });
      },

      setCoupon(code, discount) {
        set({ couponCode: code, discount });
      },

      removeCoupon() {
        set({ couponCode: null, discount: 0 });
      },

      setShippingMethod(method) {
        set({ shippingMethod: method });
      },
    }),
    {
      name: "jardinia-cart",
      // Ne persister que les items et coupon, pas les getters
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discount: state.discount,
        shippingMethod: state.shippingMethod,
      }),
    }
  )
);
