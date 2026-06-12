import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";
import { formatPrice, orderStatusColors, orderStatusLabels } from "@/lib/utils";

export default async function AccountPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [orders, wishlistCount] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        items: { take: 1, include: { product: { include: { images: { take: 1 } } } } },
      },
    }),
    prisma.wishlistItem.count({ where: { userId } }),
  ]);

  const totalSpent = orders.reduce((a, o) => a + Number(o.total), 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Commandes", value: orders.length },
          { label: "Favoris",   value: wishlistCount },
          { label: "Total dépensé", value: formatPrice(totalSpent) },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4 text-center">
            <p className="text-2xl font-bold text-primary-600">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Dernières commandes */}
      <div className="card p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-anthracite-800 flex items-center gap-2">
            <Package size={18} /> Dernières commandes
          </h2>
          <Link href="/compte/commandes" className="text-sm text-primary-600 hover:underline">Voir tout</Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <ShoppingBag size={40} className="mx-auto mb-3 opacity-40" />
            <p>Aucune commande pour le moment</p>
            <Link href="/boutique" className="btn-primary mt-4 inline-flex text-sm px-4 py-2">
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/compte/commandes/${order.id}`}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                  {order.items[0]?.product?.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={order.items[0].product.images[0].url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package size={20} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-anthracite-700 text-sm">Commande #{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-sm">{formatPrice(Number(order.total))}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${orderStatusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {orderStatusLabels[order.status] ?? order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
