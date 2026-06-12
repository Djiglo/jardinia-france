import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, Package } from "lucide-react";
import { formatPrice, formatDate, orderStatusColors, orderStatusLabels } from "@/lib/utils";
import OrderActions from "./OrderActions";

interface Props { params: Promise<{ id: string }> }

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { include: { images: { take: 1, orderBy: { sortOrder: "asc" } } } } } },
      user:  { select: { name: true, email: true } },
      history: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) notFound();

  const address = order.shippingAddress as any;

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/commandes" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft size={14} /> Commandes
        </Link>
        <h1 className="text-2xl font-bold text-anthracite-900">#{order.orderNumber}</h1>
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${orderStatusColors[order.status] ?? "bg-gray-100"}`}>
          {orderStatusLabels[order.status] ?? order.status}
        </span>
        <span className="text-sm text-gray-400 ml-auto">{formatDate(order.createdAt)}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Articles */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-anthracite-800 mb-4 flex items-center gap-2"><Package size={16} /> Articles</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {item.product?.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />
                    ) : <Package size={18} className="m-auto text-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-anthracite-800 truncate">{item.name}</p>
                    {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
                    <p className="text-xs text-gray-400">Qté : {item.quantity} · {formatPrice(Number(item.price))} / unité</p>
                  </div>
                  <p className="font-semibold text-sm shrink-0">{formatPrice(Number(item.total))}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500"><span>Sous-total</span><span>{formatPrice(Number(order.subtotal))}</span></div>
              <div className="flex justify-between text-gray-500"><span>Livraison</span><span>{Number(order.shippingCost) === 0 ? "Gratuite" : formatPrice(Number(order.shippingCost))}</span></div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-600"><span>Réduction</span><span>-{formatPrice(Number(order.discount))}</span></div>
              )}
              <div className="flex justify-between font-bold text-anthracite-800 text-base border-t border-gray-100 pt-2">
                <span>Total</span><span>{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>

          {/* Historique */}
          {order.history.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-anthracite-800 mb-4">Historique des statuts</h2>
              <ol className="space-y-3">
                {order.history.map((h) => (
                  <li key={h.id} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary-400 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-medium">{orderStatusLabels[h.status] ?? h.status}</p>
                      {h.comment && <p className="text-gray-500 text-xs">{h.comment}</p>}
                      <p className="text-xs text-gray-400">{formatDate(h.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Actions */}
          <OrderActions orderId={order.id} currentStatus={order.status} trackingNumber={order.trackingNumber ?? ""} />

          {/* Client */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-anthracite-800 mb-3">Client</h2>
            {order.user ? (
              <div className="text-sm text-gray-600 space-y-0.5">
                <p className="font-medium text-anthracite-800">{order.user.name}</p>
                <p>{order.user.email}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Commande invité</p>
            )}
          </div>

          {/* Adresse */}
          {address && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-anthracite-800 mb-3">Livraison</h2>
              <address className="not-italic text-sm text-gray-600 space-y-0.5">
                <p className="font-medium text-anthracite-800">{address.firstName} {address.lastName}</p>
                {address.company && <p>{address.company}</p>}
                <p>{address.address ?? address.address1}</p>
                {address.address2 && <p>{address.address2}</p>}
                <p>{address.postalCode} {address.city}</p>
                <p>{address.country}</p>
                {address.phone && <p className="mt-1">{address.phone}</p>}
              </address>
              {order.shippingMethod && (
                <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
                  Mode : {order.shippingMethod === "express" ? "Express (1-2j)" : "Standard (3-5j)"}
                </p>
              )}
            </div>
          )}

          {/* Paiement */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-anthracite-800 mb-3">Paiement</h2>
            <div className="text-sm space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">Méthode</span><span>{order.paymentMethod ?? "—"}</span></div>
              <div className="flex justify-between">
                <span className="text-gray-500">Statut</span>
                <span className={`font-medium ${order.paymentStatus === "PAID" ? "text-green-600" : order.paymentStatus === "FAILED" ? "text-red-600" : "text-gray-600"}`}>
                  {order.paymentStatus === "PAID" ? "Payé" : order.paymentStatus === "FAILED" ? "Échoué" : order.paymentStatus}
                </span>
              </div>
              {order.stripeSessionId && (
                <p className="text-xs text-gray-400 pt-1 truncate" title={order.stripeSessionId}>
                  Session : {order.stripeSessionId.slice(0, 20)}…
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
