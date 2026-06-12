import { NextResponse } from "next/server";
import { createStripeCheckoutSession, SHIPPING_RATES } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { items, address, shippingMethod, couponCode } = await req.json();

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

    // Resolve coupon and compute discount
    let discountAmountCents = 0;
    let couponDbId: string | undefined;

    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: (couponCode as string).toUpperCase().trim(),
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });
      if (coupon) {
        couponDbId = coupon.id;
        const v = Number(coupon.value);
        if (coupon.type === "PERCENTAGE") {
          let disc = (subtotal * v) / 100;
          if (coupon.maxDiscount) disc = Math.min(disc, Number(coupon.maxDiscount));
          discountAmountCents = Math.round(disc * 100);
        } else if (coupon.type === "FIXED_AMOUNT") {
          discountAmountCents = Math.round(Math.min(v, subtotal) * 100);
        } else if (coupon.type === "FREE_SHIPPING") {
          discountAmountCents = Math.round(shippingCost * 100);
        }
      }
    }

    // Normaliser les items pour inclure productId et sku
    const normalizedItems = items.map((item: any) => ({
      productId: item.productId ?? item.product?.id ?? "",
      sku: item.product?.sku ?? item.sku ?? "N/A",
      name: item.product?.name ?? item.name ?? "",
      price: item.variant?.price ?? item.product?.price ?? item.price ?? 0,
      quantity: item.quantity,
      image: item.product?.images?.[0]?.url ?? item.image,
    }));

    const stripeSession = await createStripeCheckoutSession({
      items: normalizedItems,
      customerEmail: address.email,
      orderId,
      shippingCost,
      discountAmountCents,
      couponDbId,
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
