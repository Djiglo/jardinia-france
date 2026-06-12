import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Search, Eye, Package } from "lucide-react";

interface Props {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { page = "1", status = "", search = "" } = await searchParams;
  const currentPage = parseInt(page);
  const perPage = 20;

  const where: any = {};
  if (status) where.status = status;
  if (search) where.OR = [
    { orderNumber: { contains: search, mode: "insensitive" } },
  ];

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * perPage,
      take: perPage,
      include: {
        _count: { select: { items: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  const STATUS_COLORS: Record<string, string> = {
    PENDING:    "bg-yellow-100 text-yellow-700",
    CONFIRMED:  "bg-blue-100 text-blue-700",
    PROCESSING: "bg-orange-100 text-orange-700",
    SHIPPED:    "bg-purple-100 text-purple-700",
    DELIVERED:  "bg-green-100 text-green-700",
    CANCELLED:  "bg-red-100 text-red-700",
    REFUNDED:   "bg-gray-100 text-gray-600",
  };
  const STATUS_LABELS: Record<string, string> = {
    PENDING:    "En attente",
    CONFIRMED:  "Confirmée",
    PROCESSING: "En préparation",
    SHIPPED:    "Expédiée",
    DELIVERED:  "Livrée",
    CANCELLED:  "Annulée",
    REFUNDED:   "Remboursée",
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-anthracite-900 flex items-center gap-2">
          <Package size={22} />
          Commandes
          <span className="text-base font-normal text-gray-400">({total})</span>
        </h1>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <form>
            <input
              name="search"
              defaultValue={search}
              placeholder="Numéro de commande..."
              className="pl-9 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </form>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
            <Link
              key={s}
              href={`/admin/commandes?${s ? `status=${s}` : ""}${search ? `&search=${search}` : ""}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                status === s ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s ? STATUS_LABELS[s] : "Toutes"}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Commande", "Date", "Client", "Articles", "Total", "Statut", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-anthracite-700">
                    #{order.orderNumber}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {(order.shippingAddress as any)?.firstName} {(order.shippingAddress as any)?.lastName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order._count.items}</td>
                  <td className="px-4 py-3 font-semibold text-anthracite-700">
                    {formatPrice(Number(order.total))}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/commandes/${order.id}`} className="p-1.5 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors inline-flex" title="Voir">
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-1 p-4 border-t border-gray-100">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/commandes?page=${p}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${
                  p === currentPage ? "bg-primary-600 text-white" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
