// ================================================
// JARDINIA FRANCE - Stripe Configuration
// ================================================
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY manquante");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});

// ========================
// Constantes livraison
// ========================
export const SHIPPING_RATES = {
  standard: {
    id: "standard",
    name: "Livraison standard",
    description: "5-7 jours ouvrés",
    price: 5.99,
    freeFrom: 79,
  },
  express: {
    id: "express",
    name: "Livraison express",
    description: "2-3 jours ouvrés",
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
  couponCode,
  successUrl,
  cancelUrl,
}: {
  items: Array<{ name: string; price: number; quantity: number; image?: string }>;
  customerEmail: string;
  orderId: string;
  shippingCost: number;
  couponCode?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
    (item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // centimes
      },
      quantity: item.quantity,
    })
  );

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
    metadata: { orderId, couponCode: couponCode ?? "" },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}
