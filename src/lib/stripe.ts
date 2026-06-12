// ================================================
// JARDINIA FRANCE - Stripe Configuration
// ================================================
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY manquante");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

// ========================
// Constantes livraison
// ========================
export const SHIPPING_RATES = {
  standard: {
    id: "standard",
    name: "Livraison standard",
    description: "3-5 jours ouvrés",
    price: 5.99,
    freeFrom: 79,
  },
  express: {
    id: "express",
    name: "Livraison express",
    description: "1-2 jours ouvrés",
    price: 12.99,
    freeFrom: null,
  },
} as const;

export const TAX_RATE = 0.20; // 20% TVA France

// ========================
// Créer une session Stripe
// ========================
export async function createStripeCheckoutSession({
  items,
  customerEmail,
  orderId,
  shippingCost,
  discountAmountCents = 0,
  couponDbId,
  successUrl,
  cancelUrl,
  userId,
  addressJson,
}: {
  items: Array<{ productId: string; sku: string; name: string; price: number; quantity: number; image?: string }>;
  customerEmail: string;
  orderId: string;
  shippingCost: number;
  discountAmountCents?: number;
  couponDbId?: string;
  successUrl: string;
  cancelUrl: string;
  userId?: string;
  addressJson?: string;
}) {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
    (item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: { productId: item.productId, sku: item.sku },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })
  );

  // Create a one-time Stripe coupon if a discount applies
  let stripeCouponId: string | undefined;
  if (discountAmountCents > 0) {
    const stripeCoupon = await stripe.coupons.create({
      amount_off: discountAmountCents,
      currency: "eur",
      duration: "once",
    });
    stripeCouponId = stripeCoupon.id;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "paypal"],
    mode: "payment",
    customer_email: customerEmail,
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: shippingCost === 0 ? "Livraison gratuite" : "Livraison",
          fixed_amount: { amount: Math.round(shippingCost * 100), currency: "eur" },
        },
      },
    ],
    ...(stripeCouponId ? { discounts: [{ coupon: stripeCouponId }] } : {}),
    metadata: {
      orderId,
      couponDbId: couponDbId ?? "",
      userId: userId ?? "",
      address: addressJson ?? "",
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}
