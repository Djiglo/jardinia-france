import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

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
    // Récupérer les line items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
    const address = session.metadata?.address ? JSON.parse(session.metadata.address) : null;
    const userId = session.metadata?.userId;

    // Calcul totaux
    const subtotal = (session.amount_subtotal ?? 0) / 100;
    const shippingTotal = (session.total_details?.amount_shipping ?? 0) / 100;
    const discountTotal = (session.total_details?.amount_discount ?? 0) / 100;
    const total = (session.amount_total ?? 0) / 100;

    // Créer la commande
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: userId ?? null,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        paymentMethod: "stripe",
        stripeSessionId: session.id,
        subtotal,
        shippingTotal,
        discountTotal,
        total,
        shippingAddress: address ? {
          firstName: address.firstName,
          lastName: address.lastName,
          address: address.address,
          city: address.city,
          postalCode: address.postalCode,
          country: address.country,
          phone: address.phone,
        } : {},
        items: {
          create: lineItems.data.map((item) => ({
            productId: item.price?.product as string,
            name: item.description ?? "",
            price: (item.price?.unit_amount ?? 0) / 100,
            quantity: item.quantity ?? 1,
            total: ((item.price?.unit_amount ?? 0) * (item.quantity ?? 1)) / 100,
          })),
        },
      },
    });

    // Email de confirmation
    if (session.customer_email) {
      sendOrderConfirmationEmail({
        to: session.customer_email,
        firstName: address?.firstName ?? "Client",
        orderNumber: order.orderNumber,
        total,
        items: lineItems.data.map((i) => ({
          name: i.description ?? "",
          quantity: i.quantity ?? 1,
          price: (i.price?.unit_amount ?? 0) / 100,
        })),
      }).catch(console.error);
    }

    // Mettre à jour les stocks
    for (const item of lineItems.data) {
      if (item.price?.product) {
        await prisma.product.update({
          where: { id: item.price.product as string },
          data: { stock: { decrement: item.quantity ?? 1 } },
        }).catch(console.error);
      }
    }

    console.log(`✅ Order ${order.orderNumber} created for ${session.customer_email}`);
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
}
