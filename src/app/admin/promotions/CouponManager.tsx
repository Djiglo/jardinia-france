"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Save, Tag } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  value: number;
  minOrderAmount: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  _count: { orders: number };
}

const TYPE_LABELS: Record<string, string> = {
  PERCENTAGE:   "Pourcentage (%)",
  FIXED_AMOUNT: "Montant fixe (€)",
  FREE_SHIPPING: "Livraison offerte",
};

const emptyForm = {
  code: "", type: "PERCENTAGE" as Coupon["type"], value: "", minOrderAmount: "",
  maxDiscount: "", usageLimit: "", isActive: true, expiresAt: "",
};

export default function CouponManager({ initial }: { initial: Coupon[] }) {
  const router = useRouter();
  const [coupons, setCoupons] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code:           c.code,
      type:           c.type,
      value:          String(c.value),
      minOrderAmount: c.minOrderAmount != null ? String(c.minOrderAmount) : "",
      maxDiscount:    c.maxDiscount    != null ? String(c.maxDiscount)    : "",
      usageLimit:     c.usageLimit     != null ? String(c.usageLimit)     : "",
      isActive:       c.isActive,
      expiresAt:      c.expiresAt ? c.expiresAt.slice(0, 10) : "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url    = editing ? `/api/coupons/${editing.id}` : "/api/coupons";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erreur"); return; }
      setShowForm(false);
      router.refresh();
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (c: Coupon) => {
    const res = await fetch(`/api/coupons/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: c.code, type: c.type, value: c.value,
        minOrderAmount: c.minOrderAmount, maxDiscount: c.maxDiscount,
        usageLimit: c.usageLimit, isActive: !c.isActive, expiresAt: c.expiresAt,
      }),
    });
    if (!res.ok) return;
    setCoupons((prev) => prev.map((x) => x.id === c.id ? { ...x, isActive: !x.isActive } : x));
  };

  const deleteCoupon = async (c: Coupon) => {
    if (!confirm(`Supprimer le code "${c.code}" ?`)) return;
    const res = await fetch(`/api/coupons/${c.id}`, { method: "DELETE" });
    if (!res.ok) return;
    setCoupons((prev) => prev.filter((x) => x.id !== c.id));
  };

  const inp = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-anthracite-900">Promotions & Coupons</h1>
          <p className="text-sm text-gray-400 mt-1">{coupons.length} code{coupons.length !== 1 ? "s" : ""} de réduction</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm">
          <Plus size={16} /> Nouveau coupon
        </button>
      </div>

      {/* Tableau */}
      {coupons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Tag size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">Aucun coupon créé</p>
          <p className="text-sm text-gray-400 mt-1">Créez votre premier code de réduction</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Valeur</th>
                <th className="px-4 py-3 text-left">Utilisations</th>
                <th className="px-4 py-3 text-left">Expiration</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map((c) => {
                const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
                const exhausted = c.usageLimit != null && c.usageCount >= c.usageLimit;
                return (
                  <tr key={c.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-anthracite-800 bg-gray-100 px-2 py-0.5 rounded">
                        {c.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{TYPE_LABELS[c.type]}</td>
                    <td className="px-4 py-3 font-semibold text-primary-700">
                      {c.type === "PERCENTAGE"    ? `${c.value}%`
                       : c.type === "FREE_SHIPPING" ? "Livraison gratuite"
                       : formatPrice(c.value)}
                      {c.minOrderAmount != null && (
                        <p className="text-xs text-gray-400 font-normal">min. {formatPrice(c.minOrderAmount)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`${exhausted ? "text-red-600" : "text-gray-600"}`}>
                        {c.usageCount}{c.usageLimit != null ? ` / ${c.usageLimit}` : ""}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {c.expiresAt ? (
                        <span className={expired ? "text-red-600 font-medium" : "text-gray-600"}>
                          {formatDate(new Date(c.expiresAt))}
                          {expired && " (expiré)"}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(c)} className="flex items-center gap-1.5 text-sm">
                        {c.isActive && !expired && !exhausted ? (
                          <><ToggleRight size={20} className="text-green-500" /><span className="text-green-600">Actif</span></>
                        ) : (
                          <><ToggleLeft size={20} className="text-gray-400" /><span className="text-gray-400">Inactif</span></>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-primary-600 p-1.5 rounded-lg hover:bg-primary-50 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => deleteCoupon(c)} className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-anthracite-800 text-lg">
                {editing ? "Modifier le coupon" : "Nouveau coupon"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code promo *</label>
                  <input
                    value={form.code}
                    onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase().replace(/\s/g, "") }))}
                    required
                    placeholder="JARDINIA10"
                    className={`${inp} font-mono uppercase`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as any }))} className={inp}>
                    <option value="PERCENTAGE">Pourcentage (%)</option>
                    <option value="FIXED_AMOUNT">Montant fixe (€)</option>
                    <option value="FREE_SHIPPING">Livraison offerte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {form.type === "PERCENTAGE" ? "Réduction (%)" : form.type === "FREE_SHIPPING" ? "Valeur (0)" : "Montant (€)"} *
                  </label>
                  <input
                    type="number" step="0.01" min="0"
                    value={form.type === "FREE_SHIPPING" ? "0" : form.value}
                    onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                    disabled={form.type === "FREE_SHIPPING"}
                    required
                    className={inp}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant min. (€)</label>
                  <input
                    type="number" step="0.01" min="0"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: e.target.value }))}
                    placeholder="Aucun minimum"
                    className={inp}
                  />
                </div>

                {form.type === "PERCENTAGE" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Réduction max. (€)</label>
                    <input
                      type="number" step="0.01" min="0"
                      value={form.maxDiscount}
                      onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value }))}
                      placeholder="Illimitée"
                      className={inp}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Limite d'utilisation</label>
                  <input
                    type="number" min="1"
                    value={form.usageLimit}
                    onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
                    placeholder="Illimitée"
                    className={inp}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                    className={inp}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${form.isActive ? "bg-primary-600" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
                <span className="text-sm font-medium text-gray-700">Coupon actif</span>
              </label>

              {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 btn-outline py-2.5 text-sm">
                  Annuler
                </button>
                <button type="submit" disabled={loading} className="flex-1 btn-primary flex items-center justify-center gap-2 py-2.5 text-sm">
                  <Save size={14} />
                  {loading ? "Enregistrement…" : editing ? "Mettre à jour" : "Créer le coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
