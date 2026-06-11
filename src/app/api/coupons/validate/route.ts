export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { code, subtotal } = await req.json();
  if (!code) return NextResponse.json({ valid: false, message: "Code manquant" }, { status: 400 });

  const coupon = await prisma.coupon.findFirst({
    where: { code: code.toUpperCase(), isActive: true },
  });

  if (!coupon) return NextResponse.json({ valid: false, message: "Code invalide" });

  const now = new Date();
  if (coupon.expiresAt && coupon.expiresAt < now)
    return NextResponse.json({ valid: false, message: "Code expiré" });
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit)
    return NextResponse.json({ valid: false, message: "Code épuisé" });
  if (coupon.minimumAmount && subtotal < coupon.minimumAmount)
    return NextResponse.json({ valid: false, message: `Minimum d'achat : ${coupon.minimumAmount}€` });

  return NextResponse.json({
    valid: true,
    code: coupon.code,
    discount: coupon.discount,
    type: coupon.type,
    description: coupon.description,
  });
}