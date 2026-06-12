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
