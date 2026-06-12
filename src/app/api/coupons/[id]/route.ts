import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function requireAdmin(session: any) {
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  return null;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const deny = requireAdmin(session);
  if (deny) return deny;

  const { id } = await params;
  const body = await req.json();
  const { code, type, value, minOrderAmount, maxDiscount, usageLimit, isActive, expiresAt } = body;

  if (!code || typeof code !== "string" || !code.trim())
    return NextResponse.json({ error: "Code requis" }, { status: 400 });
  if (!["percentage", "fixed", "free_shipping"].includes(type))
    return NextResponse.json({ error: "Type invalide" }, { status: 400 });
  const parsedValue = parseFloat(value);
  if (isNaN(parsedValue) || parsedValue <= 0)
    return NextResponse.json({ error: "Valeur invalide" }, { status: 400 });
  if (type === "percentage" && parsedValue > 100)
    return NextResponse.json({ error: "Pourcentage ne peut pas dépasser 100%" }, { status: 400 });
  if (usageLimit !== undefined && usageLimit !== null) {
    const parsedLimit = parseInt(usageLimit);
    if (isNaN(parsedLimit) || parsedLimit < 1)
      return NextResponse.json({ error: "Limite d'utilisation invalide" }, { status: 400 });
  }

  const coupon = await prisma.coupon.update({
    where: { id },
    data: {
      code:           code?.toUpperCase().trim(),
      type,
      value:          parseFloat(value),
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
      maxDiscount:    maxDiscount    ? parseFloat(maxDiscount)    : null,
      usageLimit:     usageLimit     ? parseInt(usageLimit)       : null,
      isActive:       isActive ?? true,
      expiresAt:      expiresAt ? new Date(expiresAt) : null,
    },
  });

  return NextResponse.json(coupon);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const deny = requireAdmin(session);
  if (deny) return deny;

  const { id } = await params;
  await prisma.coupon.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
