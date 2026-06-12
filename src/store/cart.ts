import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductVariant } from "@/types";
import { calculateShipping } from "@/lib/utils";

export interface LocalCartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  product: Product;
  variant: ProductVariant | null;
}

export interface AppliedCoupon {
  code: string;
  discount: number;
  type: "percentage" | "fixed" | "free_shipping";
}

interface CartStore {
  items: LocalCartItem[];
  coupon: AppliedCoupon | null;
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
  setCoupon: (coupon: AppliedCoupon | null) => void;
  removeCoupon: () => void;
  setShippingMethod: (method: "standard" | "express") => void;
}

function makeItemId(productId: string, variantId: string | null) {
  return variantId ? `${productId}-${variantId}` : productId;
}

function computeDiscount(coupon: AppliedCoupon | null, subtotal: number): number {
  if (!coupon) return 0;
  if (coupon.type === "percentage") return (subtotal * coupon.discount) / 100;
  if (coupon.type === "free_shipping") return 0;
  return coupon.discount;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      shippingMethod: "standard",

      get itemCount() {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      get subtotal() {
        return get().items.reduce((acc, item) => {
          const price =
            item.variant?.price !== null && item.variant?.price !== undefined
              ? item.variant.price
              : item.product.price;
          return acc + price * item.quantity;
        }, 0);
      },

      get shippingCost() {
        const s = get();
        const base = calculateShipping(s.subtotal, s.shippingMethod);
        return s.coupon?.type === "free_shipping" ? 0 : base;
      },

      get total() {
        const s = get();
        const disc = computeDiscount(s.coupon, s.subtotal);
        return Math.max(0, s.subtotal + s.shippingCost - disc);
      },

      addItem(product, variant = null, qty = 1) {
        const itemId = makeItemId(product.id, variant?.id ?? null);
        set((state) => {
          const existing = state.items.find((i) => i.id === itemId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === itemId ? { ...i, quantity: i.quantity + qty } : i
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
        set((state) => ({ items: state.items.filter((i) => i.id !== itemId) }));
      },

      updateQuantity(itemId, quantity) {
        if (quantity <= 0) { get().removeItem(itemId); return; }
        set((state) => ({
          items: state.items.map((i) => i.id === itemId ? { ...i, quantity } : i),
        }));
      },

      clearCart() {
        set({ items: [], coupon: null });
      },

      setCoupon(coupon) {
        set({ coupon });
      },

      removeCoupon() {
        set({ coupon: null });
      },

      setShippingMethod(method) {
        set({ shippingMethod: method });
      },
    }),
    {
      name: "jardinia-cart",
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        shippingMethod: state.shippingMethod,
      }),
    }
  )
);
