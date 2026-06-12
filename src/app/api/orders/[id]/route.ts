import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { id } = await params;
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string);

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: { include: { images: { take: 1, orderBy: { sortOrder: "asc" } } } } },
      },
      history: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  // Un client ne peut voir que ses propres commandes
  if (!isAdmin && order.userId !== session.user.id) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  return NextResponse.json(order);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const VALID_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

  const { id } = await params;
  const { status, trackingNumber, comment } = await req.json();

  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(trackingNumber !== undefined && { trackingNumber: trackingNumber || null }),
        ...(status && {
          history: {
            create: { status, comment: comment ?? null },
          },
        }),
      },
      include: { items: true, history: { orderBy: { createdAt: "asc" } } },
    });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }
}
