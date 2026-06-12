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

    // ─── 1. Vérifier les prix et le stock depuis la DB (jamais depuis le client) ──
    const productIds: string[] = items
      .map((i: any) => i.productId ?? i.product?.id)
      .filter(Boolean);

    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
    });
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    const normalizedItems: {
      productId: string; sku: string; name: string; price: number; quantity: number; image?: string;
    }[] = [];

    for (const item of items) {
      const productId: string = item.productId ?? item.product?.id ?? "";
      const dbProduct = productMap.get(productId);

      if (!dbProduct) {
        return NextResponse.json(
          { error: `Produit introuvable ou indisponible : ${item.product?.name ?? productId}` },
          { status: 400 }
        );
      }
      if (dbProduct.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour "${dbProduct.name}" (${dbProduct.stock} disponible${dbProduct.stock > 1 ? "s" : ""})` },
          { status: 409 }
        );
      }

      normalizedItems.push({
        productId,
        sku:      dbProduct.sku,
        name:     dbProduct.name,
        price:    Number(dbProduct.price), // Prix autoritatif depuis la DB
        quantity: item.quantity,
        image:    dbProduct.images[0]?.url,
      });
    }

    const orderId  = crypto.randomUUID();
    const appUrl   = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const subtotal = normalizedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const rate         = SHIPPING_RATES[shippingMethod as keyof typeof SHIPPING_RATES] ?? SHIPPING_RATES.standard;
    const shippingCost = rate.freeFrom !== null && subtotal >= rate.freeFrom ? 0 : rate.price;

    // ─── 2. Valider le coupon côté serveur ────────────────────────────────────────
    let discountAmountCents = 0;
    let couponDbId: string | undefined;

    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code:     (couponCode as string).toUpperCase().trim(),
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });

      if (coupon) {
        // Re-vérifier la limite d'utilisation
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
          return NextResponse.json(
            { error: "Ce code de réduction a atteint sa limite d'utilisation" },
            { status: 400 }
          );
        }
        // Re-vérifier le montant minimum
        if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
          return NextResponse.json(
            { error: `Ce code nécessite un minimum de commande de ${Number(coupon.minOrderAmount).toFixed(2)} €` },
            { status: 400 }
          );
        }

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

    const stripeSession = await createStripeCheckoutSession({
      items: normalizedItems,
      customerEmail: address.email,
      orderId,
      shippingCost,
      discountAmountCents,
      couponDbId,
      successUrl: `${appUrl}/checkout/success?order=${orderId}`,
      cancelUrl:  `${appUrl}/panier`,
      userId:     session?.user?.id,
      addressJson: JSON.stringify(address),
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Erreur lors de la création du paiement" }, { status: 500 });
  }
}
