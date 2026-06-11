"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";

const STATUS_CONFIG = {
  PENDING:    { label: "En attente",  icon: Clock,        color: "text-yellow-600",  bg: "bg-yellow-50"  },
  CONFIRMED:  { label: "Confirmée",   icon: CheckCircle,  color: "text-blue-600",    bg: "bg-blue-50"    },
  PROCESSING: { label: "En cours",    icon: Package,      color: "text-orange-600",  bg: "bg-orange-50"  },
  SHIPPED:    { label: "Expédiée",    icon: Truck,        color: "text-purple-600",  bg: "bg-purple-50"  },
  DELIVERED:  { label: "Livrée",      icon: CheckCircle,  color: "text-green-600",   bg: "bg-green-50"   },
  CANCELLED:  { label: "Annulée",     icon: XCircle,      color: "text-red-600",     bg: "bg-red-50"     },
} as const;

export default function SuiviCommandePage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${orderNumber}&email=${email}`);
      const data = await res.json();

      if (!res.ok || !data.order) {
        setError("Commande introuvable. Vérifiez le numéro et l'adresse e-mail.");
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-4">
          <Package size={24} className="text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-anthracite-900 mb-2">Suivi de commande</h1>
        <p className="text-gray-500">Entrez votre numéro de commande et votre e-mail pour suivre votre colis.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de commande
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="ex: JRD-20250001"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse e-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
          >
            <Search size={16} />
            {loading ? "Recherche en cours..." : "Suivre ma commande"}
          </button>
        </div>
      </form>

      {order && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {(() => {
            const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.PENDING;
            const Icon = cfg.icon;
            return (
              <>
                <div className={`flex items-center gap-3 rounded-xl p-4 mb-5 ${cfg.bg}`}>
                  <Icon size={20} className={cfg.color} />
                  <div>
                    <p className="font-semibold text-anthracite-800">Commande #{order.orderNumber}</p>
                    <p className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</p>
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-500 mb-1">Numéro de suivi transporteur</p>
                    <p className="font-mono font-semibold text-anthracite-800">{order.trackingNumber}</p>
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-4">
                  Commande passée le{" "}
                  {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </>
            );
          })()}
        </div>
      )}

      <p className="text-center text-sm text-gray-400 mt-6">
        Vous avez un compte ?{" "}
        <Link href="/compte/commandes" className="text-primary-600 hover:underline">
          Consultez vos commandes directement
        </Link>
      </p>
    </div>
  );
}
