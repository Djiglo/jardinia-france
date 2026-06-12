import { prisma } from "@/lib/prisma";
import CouponManager from "./CouponManager";

export default async function PromotionsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  const serialized = coupons.map((c) => ({
    ...c,
    value:          Number(c.value),
    minOrderAmount: c.minOrderAmount != null ? Number(c.minOrderAmount) : null,
    maxDiscount:    c.maxDiscount    != null ? Number(c.maxDiscount)    : null,
    expiresAt:      c.expiresAt?.toISOString() ?? null,
    createdAt:      c.createdAt.toISOString(),
  }));

  return (
    <div className="p-8">
      <CouponManager initial={serialized} />
    </div>
  );
}
