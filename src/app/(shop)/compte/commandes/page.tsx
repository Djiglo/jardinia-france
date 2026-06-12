import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { formatPrice, orderStatusColors, orderStatusLabels } from "@/lib/utils";

export default async function CommandesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    const { redirect } = await import("next/navigation");
    redirect("/auth/connexion?callbackUrl=/compte/commandes");
  }
  const userId = session.user.id!;

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: { include: { images: { take: 1, orderBy: { sortOrder: "asc" } } } } },
      },
    },
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-anthracite-900 mb-6 flex items-center gap-2">
        <Package size={20} /> Mes commandes
        <span className="text-base font-normal text-gray-400">({orders.length})</span>
      </h1>

      {orders.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <Package size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium mb-2">Aucune commande</p>
          <p className="text-sm mb-6">Vous n&apos;avez pas encore passé de commande.</p>
          <Link href="/boutique" className="btn-primary inline-flex text-sm px-6 py-2.5">
            Découvrir la boutique
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/compte/commandes/${order.id}`}
              className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              {/* Miniatures produits */}
              <div className="flex -space-x-2 shrink-0">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="w-12 h-12 rounded-lg border-2 border-white overflow-hidden bg-gray-100">
                    {item.product?.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Package size={16} className="m-auto text-gray-300" />
                    )}
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="w-12 h-12 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-anthracite-800">Commande #{order.orderNumber}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  {" · "}{order.items.length} article{order.items.length > 1 ? "s" : ""}
                </p>
              </div>

              {/* Statut + total */}
              <div className="text-right shrink-0">
                <p className="font-bold text-anthracite-800">{formatPrice(Number(order.total))}</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${orderStatusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {orderStatusLabels[order.status] ?? order.status}
                </span>
              </div>
              <ChevronRight size={18} className="text-gray-400 shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
