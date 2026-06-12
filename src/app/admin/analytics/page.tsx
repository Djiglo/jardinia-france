import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, ShoppingBag, Users, Star } from "lucide-react";

async function getAnalytics() {
  const now = new Date();

  // Last 6 months revenue + orders
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      label: d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
      start: d,
      end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
    };
  });

  const monthlyData = await Promise.all(
    months.map(async ({ label, start, end }) => {
      const [rev, orders] = await Promise.all([
        prisma.order.aggregate({
          where: { paymentStatus: "PAID", createdAt: { gte: start, lte: end } },
          _sum: { total: true },
        }),
        prisma.order.count({
          where: { paymentStatus: "PAID", createdAt: { gte: start, lte: end } },
        }),
      ]);
      return { label, revenue: Number(rev._sum.total ?? 0), orders };
    })
  );

  const startOf6Months = months[0].start;

  // Top 5 products by revenue
  const topItems = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: { order: { paymentStatus: "PAID", createdAt: { gte: startOf6Months } } },
    _sum: { total: true, quantity: true },
    orderBy: { _sum: { total: "desc" } },
    take: 5,
  });

  const topProductIds = topItems.map((i) => i.productId);
  const topProductDetails = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true, slug: true },
  });
  const topProducts = topItems.map((item) => ({
    ...item,
    product: topProductDetails.find((p) => p.id === item.productId),
  }));

  // Order status breakdown
  const statusBreakdown = await prisma.order.groupBy({
    by: ["status"],
    _count: { _all: true },
    where: { createdAt: { gte: startOf6Months } },
  });

  // Category revenue (limité aux 50 meilleurs produits pour éviter une requête non bornée)
  const categoryRevenue = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: { order: { paymentStatus: "PAID", createdAt: { gte: startOf6Months } } },
    _sum: { total: true },
    orderBy: { _sum: { total: "desc" } },
    take: 50,
  });

  const productIds = categoryRevenue.map((i) => i.productId);
  const products = productIds.length > 0
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, category: { select: { name: true } } },
      })
    : [];

  const catMap: Record<string, number> = {};
  for (const item of categoryRevenue) {
    const cat = products.find((p) => p.id === item.productId)?.category?.name ?? "Autre";
    catMap[cat] = (catMap[cat] ?? 0) + Number(item._sum.total ?? 0);
  }
  const topCategories = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Global KPIs
  const [totalRevenue, totalOrders, totalCustomers, avgRating] = await Promise.all([
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
    prisma.order.count({ where: { paymentStatus: "PAID" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.review.aggregate({ where: { status: "APPROVED" }, _avg: { rating: true } }),
  ]);

  return { monthlyData, topProducts, statusBreakdown, topCategories, totalRevenue, totalOrders, totalCustomers, avgRating };
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente", CONFIRMED: "Confirmée", PROCESSING: "En préparation",
  SHIPPED: "Expédiée", DELIVERED: "Livrée", CANCELLED: "Annulée", REFUNDED: "Remboursée",
};
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-400", CONFIRMED: "bg-blue-400", PROCESSING: "bg-orange-400",
  SHIPPED: "bg-purple-400", DELIVERED: "bg-green-400", CANCELLED: "bg-red-400", REFUNDED: "bg-gray-400",
};

export default async function AdminAnalyticsPage() {
  const data = await getAnalytics();

  const maxRevenue = Math.max(...data.monthlyData.map((m) => m.revenue), 1);
  const maxTopRev = Math.max(...data.topProducts.map((p) => Number(p._sum.total ?? 0)), 1);
  const maxCatRev = Math.max(...data.topCategories.map(([, v]) => v), 1);

  const totalStatusCount = data.statusBreakdown.reduce((s, r) => s + r._count._all, 0) || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp size={24} className="text-primary-600" />
        <h1 className="text-2xl font-bold text-anthracite-900">Analytics</h1>
        <span className="text-sm text-gray-400">6 derniers mois</span>
      </div>

      {/* KPIs globaux */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "CA total", value: formatPrice(Number(data.totalRevenue._sum.total ?? 0)), icon: TrendingUp, color: "text-primary-600 bg-primary-50" },
          { label: "Commandes payées", value: data.totalOrders.toLocaleString("fr-FR"), icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
          { label: "Clients", value: data.totalCustomers.toLocaleString("fr-FR"), icon: Users, color: "text-violet-600 bg-violet-50" },
          { label: "Note moyenne", value: data.avgRating._avg.rating ? `${Number(data.avgRating._avg.rating).toFixed(1)} / 5` : "—", icon: Star, color: "text-amber-600 bg-amber-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`p-2 rounded-xl w-fit ${color} mb-3`}><Icon size={18} /></div>
            <p className="text-2xl font-bold text-anthracite-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenus mensuels */}
        <div className="card p-5">
          <h2 className="font-semibold text-anthracite-800 mb-4">Revenus mensuels</h2>
          <div className="flex items-end gap-2 h-40">
            {data.monthlyData.map((m) => (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400">{formatPrice(m.revenue)}</span>
                <div
                  className="w-full bg-primary-500 rounded-t-md transition-all"
                  style={{ height: `${(m.revenue / maxRevenue) * 100}%`, minHeight: m.revenue > 0 ? "4px" : "0" }}
                />
                <span className="text-xs text-gray-500 mt-1">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Commandes par statut */}
        <div className="card p-5">
          <h2 className="font-semibold text-anthracite-800 mb-4">Statuts des commandes</h2>
          <div className="space-y-3">
            {data.statusBreakdown
              .sort((a, b) => b._count._all - a._count._all)
              .map((row) => (
                <div key={row.status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{STATUS_LABELS[row.status] ?? row.status}</span>
                    <span className="font-medium text-anthracite-700">{row._count._all}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${STATUS_COLORS[row.status] ?? "bg-gray-400"}`}
                      style={{ width: `${(row._count._all / totalStatusCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top produits */}
        <div className="card p-5">
          <h2 className="font-semibold text-anthracite-800 mb-4">Top produits (par CA)</h2>
          <div className="space-y-3">
            {data.topProducts.map((item, i) => {
              const rev = Number(item._sum.total ?? 0);
              return (
                <div key={item.productId} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-anthracite-700 truncate">{item.product?.name ?? "—"}</p>
                    <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${(rev / maxTopRev) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-semibold text-anthracite-800">{formatPrice(rev)}</p>
                    <p className="text-gray-400">{item._sum.quantity ?? 0} ventes</p>
                  </div>
                </div>
              );
            })}
            {data.topProducts.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Pas encore de données</p>
            )}
          </div>
        </div>

        {/* Top catégories */}
        <div className="card p-5">
          <h2 className="font-semibold text-anthracite-800 mb-4">Top catégories (par CA)</h2>
          <div className="space-y-3">
            {data.topCategories.map(([cat, rev], i) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-anthracite-700">{cat}</p>
                  <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full"
                      style={{ width: `${(rev / maxCatRev) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-semibold text-anthracite-800">{formatPrice(rev)}</span>
              </div>
            ))}
            {data.topCategories.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Pas encore de données</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
