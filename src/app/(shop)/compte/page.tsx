import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, Heart, MapPin, User, LogOut, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/connexion?callbackUrl=/compte");

  const [orders, wishlistCount] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: { take: 1, include: { product: { include: { images: { take: 1 } } } } } },
    }),
    prisma.wishlistItem.count({ where: { userId: session.user.id } }),
  ]);

  const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  const STATUS_LABELS: Record<string, string> = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    SHIPPED: "Expédiée",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-bold text-lg">
                  {session.user.name?.[0]?.toUpperCase() ?? "U"}
                </span>
              </div>
              <div>
                <p className="font-semibold text-anthracite-800">{session.user.name}</p>
                <p className="text-xs text-gray-500 truncate max-w-[140px]">{session.user.email}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {[
                { href: "/compte", label: "Tableau de bord", icon: User },
                { href: "/compte/commandes", label: "Mes commandes", icon: Package },
                { href: "/compte/favoris", label: "Mes favoris", icon: Heart },
                { href: "/compte/adresses", label: "Mes adresses", icon: MapPin },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                >
                  <Icon size={17} />
                  {label}
                </Link>
              ))}
              <Link
                href="/api/auth/signout"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors mt-2 border-t border-gray-100 pt-3"
              >
                <LogOut size={17} />
                Déconnexion
              </Link>
            </nav>
          </div>
        </aside>

        {/* Contenu principal */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <p className="text-3xl font-bold text-primary-600">{orders.length}</p>
              <p className="text-sm text-gray-500 mt-1">Commande{orders.length > 1 ? "s" : ""}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-3xl font-bold text-primary-600">{wishlistCount}</p>
              <p className="text-sm text-gray-500 mt-1">Favoris</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-3xl font-bold text-primary-600">
                {formatPrice(orders.reduce((a, o) => a + o.total, 0))}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total dépensé</p>
            </div>
          </div>

          {/* Dernières commandes */}
          <div className="card p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-anthracite-800 flex items-center gap-2">
                <Package size={18} /> Dernières commandes
              </h2>
              <Link href="/compte/commandes" className="text-sm text-primary-600 hover:underline">
                Voir tout
              </Link>
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ShoppingBag size={40} className="mx-auto mb-3 opacity-40" />
                <p>Aucune commande pour le moment</p>
                <Link href="/boutique" className="btn-primary mt-4 inline-flex">
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
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {order.items[0]?.product?.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={order.items[0].product.images[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Package size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-anthracite-700 text-sm">
                        Commande #{order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatPrice(order.total)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
