import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(req: Request) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handlePaymentSuccess(session);
  }

  if (event.type === "payment_intent.payment_failed") {
    const pi = event.data.object as Stripe.PaymentIntent;
    console.error("Payment failed:", pi.id);
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSuccess(session: Stripe.Checkout.Session) {
  try {
    // ─── Idempotence : ne pas créer la commande deux fois ──────────────────────
    if (session.id) {
      const existing = await prisma.order.findFirst({ where: { stripeSessionId: session.id } });
      if (existing) {
        console.log(`⚠️ Webhook dupliqué ignoré — commande ${existing.orderNumber} déjà créée`);
        return;
      }
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
      expand: ["data.price.product"],
    });

    let address = null;
    try {
      address = session.metadata?.address ? JSON.parse(session.metadata.address) : null;
    } catch {
      console.error("Webhook: impossible de parser session.metadata.address", session.metadata?.address);
    }
    const userId     = session.metadata?.userId   || null;
    const couponDbId = session.metadata?.couponDbId || null;

    const subtotal    = (session.amount_subtotal ?? 0) / 100;
    const shippingCost = (session.total_details?.amount_shipping ?? 0) / 100;
    const discount    = (session.total_details?.amount_discount ?? 0) / 100;
    const total       = (session.amount_total ?? 0) / 100;

    const orderItems = lineItems.data
      .map((item) => {
        const product   = item.price?.product as Stripe.Product | null;
        const productId = product?.metadata?.productId ?? "";
        const sku       = product?.metadata?.sku ?? "N/A";
        const price     = (item.price?.unit_amount ?? 0) / 100;
        return { productId: productId || undefined as any, name: item.description ?? product?.name ?? "", sku, price, quantity: item.quantity ?? 1, total: price * (item.quantity ?? 1) };
      })
      .filter((i) => i.productId);

    // ─── Créer la commande + décrémenter stock + incrémenter coupon en 1 transaction ─
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber:     generateOrderNumber(),
          userId,
          couponId:        couponDbId,
          status:          "CONFIRMED",
          paymentStatus:   "PAID",
          paymentMethod:   "stripe",
          stripeSessionId: session.id,
          subtotal,
          shippingCost,
          discount,
          total,
          shippingAddress: address ?? {},
          items: { create: orderItems },
        },
      });

      // Décrémenter le stock — empêche les valeurs négatives
      for (const item of lineItems.data) {
        const product   = item.price?.product as Stripe.Product | null;
        const productId = product?.metadata?.productId;
        if (productId) {
          await tx.product.updateMany({
            where: { id: productId, stock: { gte: item.quantity ?? 1 } },
            data:  { stock: { decrement: item.quantity ?? 1 } },
          });
        }
      }

      // Incrémenter l'utilisation du coupon
      if (couponDbId) {
        await tx.coupon.update({
          where: { id: couponDbId },
          data:  { usageCount: { increment: 1 } },
        });
      }

      return created;
    });

    // Email de confirmation (hors transaction — non bloquant)
    if (session.customer_email) {
      sendOrderConfirmationEmail({
        to:          session.customer_email,
        firstName:   address?.firstName ?? "Client",
        orderNumber: order.orderNumber,
        total,
        items: lineItems.data.map((i) => ({
          name:     i.description ?? "",
          quantity: i.quantity ?? 1,
          price:    (i.price?.unit_amount ?? 0) / 100,
        })),
      }).catch(console.error);
    }

    console.log(`✅ Commande ${order.orderNumber} créée pour ${session.customer_email}`);
  } catch (error) {
    console.error("Erreur traitement paiement:", error);
    throw error; // Laisser Stripe ré-essayer si erreur non idempotente
  }
}
