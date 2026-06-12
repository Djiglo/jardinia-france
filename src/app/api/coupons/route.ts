import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function requireAdmin(session: any) {
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const session = await auth();
  const deny = requireAdmin(session);
  if (deny) return deny;

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return NextResponse.json(coupons);
}

export async function POST(req: Request) {
  const session = await auth();
  const deny = requireAdmin(session);
  if (deny) return deny;

  const body = await req.json();
  const { code, type, value, minOrderAmount, maxDiscount, usageLimit, isActive, expiresAt } = body;

  if (!code || !type || value === undefined) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }

  const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (existing) return NextResponse.json({ error: "Ce code existe déjà" }, { status: 409 });

  const coupon = await prisma.coupon.create({
    data: {
      code:           code.toUpperCase().trim(),
      type,
      value:          parseFloat(value),
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
      maxDiscount:    maxDiscount    ? parseFloat(maxDiscount)    : null,
      usageLimit:     usageLimit     ? parseInt(usageLimit)       : null,
      isActive:       isActive ?? true,
      expiresAt:      expiresAt ? new Date(expiresAt) : null,
    },
  });

  return NextResponse.json(coupon, { status: 201 });
}
