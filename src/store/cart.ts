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

  // Derived (recomputed on every mutation)
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

function recalc(
  items: LocalCartItem[],
  coupon: AppliedCoupon | null,
  shippingMethod: "standard" | "express"
): { itemCount: number; subtotal: number; shippingCost: number; total: number } {
  const subtotal = items.reduce((acc, item) => {
    const price =
      item.variant?.price != null
        ? Number(item.variant.price)
        : Number(item.product.price);
    return acc + price * item.quantity;
  }, 0);

  const base = calculateShipping(subtotal, shippingMethod);
  const shippingCost = coupon?.type === "free_shipping" ? 0 : base;
  const disc = computeDiscount(coupon, subtotal);
  const total = Math.max(0, subtotal + shippingCost - disc);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return { itemCount, subtotal, shippingCost, total };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      shippingMethod: "standard",
      itemCount: 0,
      subtotal: 0,
      shippingCost: 0,
      total: 0,

      addItem(product, variant = null, qty = 1) {
        set((state) => {
          const itemId = makeItemId(product.id, variant?.id ?? null);
          const existing = state.items.find((i) => i.id === itemId);
          const newItems: LocalCartItem[] = existing
            ? state.items.map((i) =>
                i.id === itemId ? { ...i, quantity: i.quantity + qty } : i
              )
            : [
                ...state.items,
                {
                  id: itemId,
                  productId: product.id,
                  variantId: variant?.id ?? null,
                  quantity: qty,
                  product,
                  variant: variant ?? null,
                },
              ];
          return { items: newItems, ...recalc(newItems, state.coupon, state.shippingMethod) };
        });
      },

      removeItem(itemId) {
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== itemId);
          return { items: newItems, ...recalc(newItems, state.coupon, state.shippingMethod) };
        });
      },

      updateQuantity(itemId, quantity) {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => {
          const newItems = state.items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          );
          return { items: newItems, ...recalc(newItems, state.coupon, state.shippingMethod) };
        });
      },

      clearCart() {
        set({ items: [], coupon: null, ...recalc([], null, get().shippingMethod) });
      },

      setCoupon(coupon) {
        set((state) => ({
          coupon,
          ...recalc(state.items, coupon, state.shippingMethod),
        }));
      },

      removeCoupon() {
        set((state) => ({
          coupon: null,
          ...recalc(state.items, null, state.shippingMethod),
        }));
      },

      setShippingMethod(method) {
        set((state) => ({
          shippingMethod: method,
          ...recalc(state.items, state.coupon, method),
        }));
      },
    }),
    {
      name: "jardinia-cart",
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        shippingMethod: state.shippingMethod,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const derived = recalc(state.items, state.coupon, state.shippingMethod);
          state.itemCount = derived.itemCount;
          state.subtotal = derived.subtotal;
          state.shippingCost = derived.shippingCost;
          state.total = derived.total;
        }
      },
    }
  )
);
