import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber")?.trim();
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!orderNumber || !email) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { orderNumber },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      trackingNumber: true,
      shippingMethod: true,
      createdAt: true,
      total: true,
      user: { select: { email: true } },
      shippingAddress: true,
      items: {
        select: { id: true, productName: true, quantity: true, unitPrice: true, total: true },
      },
    },
  });

  if (!order) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  // Vérification email : soit sur le user lié, soit dans l'adresse de livraison
  const addressEmail = (order.shippingAddress as any)?.email?.toLowerCase();
  const userEmail = order.user?.email?.toLowerCase();
  if (email !== userEmail && email !== addressEmail) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
