import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, Truck, ChevronLeft, CheckCircle, Clock, XCircle } from "lucide-react";
import { formatPrice, orderStatusColors, orderStatusLabels, formatDate } from "@/lib/utils";

interface Props { params: Promise<{ id: string }> }

const STEPS = ["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED"] as const;

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) redirect(`/auth/connexion?callbackUrl=/compte/commandes/${id}`);

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { include: { images: { take: 1, orderBy: { sortOrder: "asc" } } } } } },
      history: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!order || order.userId !== session.user.id) notFound();

  const address = order.shippingAddress as any;
  const currentStep = STEPS.indexOf(order.status as any);

  return (
    <div>
      <Link href="/compte/commandes" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ChevronLeft size={14} /> Retour à mes commandes
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-anthracite-900">Commande #{order.orderNumber}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${orderStatusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
          {orderStatusLabels[order.status] ?? order.status}
        </span>
      </div>

      {/* Progression */}
      {order.status !== "CANCELLED" && order.status !== "REFUNDED" && (
        <div className="card p-5 mb-5">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 mx-8" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-primary-500 mx-8 transition-all"
              style={{ width: `${currentStep > 0 ? (currentStep / (STEPS.length - 1)) * 100 : 0}%` }}
            />
            {STEPS.map((step, i) => {
              const done = i <= currentStep;
              return (
                <div key={step} className="flex flex-col items-center gap-1 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${done ? "bg-primary-600 border-primary-600 text-white" : "bg-white border-gray-200 text-gray-300"}`}>
                    {done ? <CheckCircle size={14} /> : <Clock size={14} />}
                  </div>
                  <span className={`text-xs text-center ${done ? "text-primary-600 font-medium" : "text-gray-400"}`}>
                    {orderStatusLabels[step]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {order.status === "CANCELLED" && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl p-4 mb-5 text-red-700">
          <XCircle size={16} /> Commande annulée
        </div>
      )}

      {/* Suivi transporteur */}
      {order.trackingNumber && (
        <div className="card p-4 mb-5 flex items-center gap-3">
          <Truck size={18} className="text-primary-600" />
          <div>
            <p className="text-sm font-medium text-anthracite-700">Numéro de suivi</p>
            <p className="font-mono text-sm text-gray-600">{order.trackingNumber}</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {/* Articles */}
        <div className="card p-5 md:col-span-2">
          <h2 className="font-semibold text-anthracite-800 mb-4 flex items-center gap-2"><Package size={16} /> Articles commandés</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                  {item.product?.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package size={20} className="m-auto text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-anthracite-800 truncate">{item.name}</p>
                  {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
                  <p className="text-xs text-gray-400">Qté : {item.quantity}</p>
                </div>
                <p className="font-semibold text-sm shrink-0">{formatPrice(Number(item.total))}</p>
              </div>
            ))}
          </div>

          {/* Totaux */}
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500"><span>Sous-total</span><span>{formatPrice(Number(order.subtotal))}</span></div>
            <div className="flex justify-between text-gray-500"><span>Livraison</span><span>{Number(order.shippingCost) === 0 ? "Gratuite" : formatPrice(Number(order.shippingCost))}</span></div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-green-600"><span>Réduction</span><span>-{formatPrice(Number(order.discount))}</span></div>
            )}
            <div className="flex justify-between font-bold text-anthracite-800 text-base pt-1 border-t border-gray-100">
              <span>Total</span><span>{formatPrice(Number(order.total))}</span>
            </div>
          </div>
        </div>

        {/* Adresse */}
        {address && (
          <div className="card p-5">
            <h2 className="font-semibold text-anthracite-800 mb-3">Adresse de livraison</h2>
            <address className="not-italic text-sm text-gray-600 space-y-0.5">
              <p className="font-medium text-anthracite-700">{address.firstName} {address.lastName}</p>
              {address.company && <p>{address.company}</p>}
              <p>{address.address ?? address.address1}</p>
              {address.address2 && <p>{address.address2}</p>}
              <p>{address.postalCode} {address.city}</p>
              <p>{address.country}</p>
              {address.phone && <p className="mt-1">{address.phone}</p>}
            </address>
          </div>
        )}

        {/* Historique */}
        {order.history.length > 0 && (
          <div className="card p-5">
            <h2 className="font-semibold text-anthracite-800 mb-3">Historique</h2>
            <ol className="space-y-3">
              {order.history.map((h) => (
                <li key={h.id} className="flex gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-medium text-anthracite-700">{orderStatusLabels[h.status] ?? h.status}</p>
                    {h.comment && <p className="text-gray-500">{h.comment}</p>}
                    <p className="text-xs text-gray-400">{formatDate(h.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
