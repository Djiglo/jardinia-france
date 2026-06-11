import { NextResponse } from "next/server";
import { createStripeCheckoutSession } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { items, address, shippingMethod, coupon } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const url = await createStripeCheckoutSession({
      items,
      customerEmail: address.email,
      shippingMethod,
      coupon,
      userId: session?.user?.id,
      metadata: { address: JSON.stringify(address) },
    });

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message ?? "Erreur paiement" }, { status: 500 });
  }
}
