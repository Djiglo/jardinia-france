import { NextResponse } from "next/server";
import { createStripeCheckoutSession, SHIPPING_RATES } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await auth();
    const { items, address, shippingMethod, coupon } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const orderId = crypto.randomUUID();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const subtotal: number = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    const rate =
      SHIPPING_RATES[shippingMethod as keyof typeof SHIPPING_RATES] ??
      SHIPPING_RATES.standard;
    const shippingCost =
      rate.freeFrom !== null && subtotal >= rate.freeFrom ? 0 : rate.price;

    const stripeSession = await createStripeCheckoutSession({
      items,
      customerEmail: address.email,
      orderId,
      shippingCost,
      couponCode: coupon ?? undefined,
      successUrl: `${appUrl}/checkout/success?order=${orderId}`,
      cancelUrl: `${appUrl}/panier`,
      userId: session?.user?.id,
      addressJson: JSON.stringify(address),
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message ?? "Erreur paiement" }, { status: 500 });
  }
}
