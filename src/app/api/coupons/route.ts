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

  const VALID_TYPES = ["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"];
  if (!code || !type || value === undefined) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "Type de coupon invalide" }, { status: 400 });
  }
  const parsedValue = parseFloat(value);
  if (isNaN(parsedValue) || parsedValue < 0) {
    return NextResponse.json({ error: "Valeur de réduction invalide" }, { status: 400 });
  }
  if (type === "PERCENTAGE" && parsedValue > 100) {
    return NextResponse.json({ error: "Le pourcentage ne peut pas dépasser 100%" }, { status: 400 });
  }
  const parsedUsageLimit = usageLimit ? parseInt(usageLimit) : null;
  if (parsedUsageLimit !== null && parsedUsageLimit < 1) {
    return NextResponse.json({ error: "La limite d'utilisation doit être ≥ 1" }, { status: 400 });
  }

  const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (existing) return NextResponse.json({ error: "Ce code existe déjà" }, { status: 409 });

  const coupon = await prisma.coupon.create({
    data: {
      code:           code.toUpperCase().trim(),
      type,
      value:          parsedValue,
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
      maxDiscount:    maxDiscount    ? parseFloat(maxDiscount)    : null,
      usageLimit:     parsedUsageLimit,
      isActive:       isActive ?? true,
      expiresAt:      expiresAt ? new Date(expiresAt) : null,
    },
  });

  return NextResponse.json(coupon, { status: 201 });
}
