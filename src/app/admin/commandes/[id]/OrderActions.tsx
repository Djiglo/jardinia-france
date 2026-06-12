"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Truck } from "lucide-react";
import { orderStatusLabels } from "@/lib/utils";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

type OrderStatus = (typeof STATUSES)[number];

interface Props {
  orderId: string;
  currentStatus: string;
  trackingNumber: string;
}

export default function OrderActions({ orderId, currentStatus, trackingNumber: initialTracking }: Props) {
  const router = useRouter();
  const [status, setStatus]   = useState<OrderStatus>(currentStatus as OrderStatus);
  const [tracking, setTracking] = useState(initialTracking);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError]     = useState("");

  const save = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          trackingNumber: tracking || null,
          comment:        comment  || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erreur lors de la mise à jour.");
        return;
      }
      setSuccess("Commande mise à jour !");
      setComment("");
      router.refresh();
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h2 className="font-semibold text-anthracite-800">Gérer la commande</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} className={inp}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{orderStatusLabels[s]}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
          <Truck size={13} /> Numéro de suivi
        </label>
        <input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="Ex : 1Z999AA10123456784"
          className={inp}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire interne</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Note optionnelle sur ce changement de statut…"
          rows={2}
          className={`${inp} resize-none`}
        />
      </div>

      {error   && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <button
        onClick={save}
        disabled={loading}
        className="w-full btn-primary flex items-center justify-center gap-2 py-2.5 text-sm"
      >
        <Save size={14} />
        {loading ? "Enregistrement…" : "Enregistrer les modifications"}
      </button>
    </div>
  );
}
