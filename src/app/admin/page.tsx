import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, ShoppingCart, Users, Package, AlertTriangle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

async function getStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalRevenue, monthRevenue, lastMonthRevenue,
    totalOrders, monthOrders,
    totalUsers, monthUsers,
    totalProducts, lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { paymentStatus: "PAID", createdAt: { gte: startOfMonth } }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { paymentStatus: "PAID", createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { total: true } }),
    prisma.order.count({ where: { paymentStatus: "PAID" } }),
    prisma.order.count({ where: { paymentStatus: "PAID", createdAt: { gte: startOfMonth } } }),
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.findMany({ where: { stock: { gt: 0, lte: 5 }, isActive: true }, take: 5, select: { id: true, name: true, stock: true, slug: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" }, take: 8,
      include: { items: { take: 1, include: { product: true } } },
    }),
  ]);

  const lastTotal = Number(lastMonthRevenue._sum.total ?? 0);
  const currTotal = Number(monthRevenue._sum.total ?? 0);
  const revenueGrowth = lastTotal > 0 ? ((currTotal - lastTotal) / lastTotal) * 100 : 0;

  return { totalRevenue, monthRevenue, revenueGrowth, totalOrders, monthOrders, totalUsers, monthUsers, totalProducts, lowStockProducts, recentOrders };
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente", CONFIRMED: "Confirmée", SHIPPED: "Expédiée", DELIVERED: "Livrée", CANCELLED: "Annulée",
};

export default async function AdminDashboard() {
  const stats = await getStats();

  const kpis = [
    {
      label: "Chiffre d'affaires (ce mois)", value: formatPrice(Number(stats.monthRevenue._sum.total ?? 0)),
      sub: `${stats.revenueGrowth >= 0 ? "+" : ""}${stats.revenueGrowth.toFixed(1)}% vs mois dernier`,
      icon: TrendingUp, color: "text-primary-600 bg-primary-50",
      trend: stats.revenueGrowth >= 0,
    },
    {
      label: "Commandes ce mois", value: stats.monthOrders.toString(),
      sub: `${stats.totalOrders} au total`, icon: ShoppingCart, color: "text-blue-600 bg-blue-50", trend: true,
    },
    {
      label: "Nouveaux clients", value: `+${stats.monthUsers}`,
      sub: `${stats.totalUsers} au total`, icon: Users, color: "text-violet-600 bg-violet-50", trend: true,
    },
    {
      label: "Produits actifs", value: stats.totalProducts.toString(),
      sub: `${stats.lowStockProducts.length} en stock faible`, icon: Package, color: "text-orange-600 bg-orange-50",
      trend: stats.lowStockProducts.length === 0,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-anthracite-900">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Bienvenue sur l'interface d'administration Jardinia</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${kpi.color}`}>
                  <Icon size={20} />
                </div>
                <ArrowUpRight size={16} className={kpi.trend ? "text-green-500" : "text-red-400"} />
              </div>
              <p className="text-2xl font-bold text-anthracite-900">{kpi.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{kpi.label}</p>
              <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Dernières commandes */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-anthracite-800">Dernières commandes</h2>
            <Link href="/admin/commandes" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
              Voir tout <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {stats.recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/commandes/${order.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-anthracite-700">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
                <span className="text-sm font-semibold text-anthracite-700 ml-2">
                  {formatPrice(Number(order.total))}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Alertes stock */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-orange-500" />
            <h2 className="font-semibold text-anthracite-800">Stocks faibles</h2>
          </div>
          {stats.lowStockProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">✓ Tous les stocks sont OK</p>
          ) : (
            <div className="space-y-2">
              {stats.lowStockProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/produits/${product.id}`}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  <span className="text-sm text-anthracite-700 truncate flex-1">{product.name}</span>
                  <span className={`text-xs font-bold ml-2 px-2 py-0.5 rounded-full ${
                    product.stock <= 2 ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
                  }`}>
                    {product.stock} restants
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
