"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  initial: Record<string, string>;
}

const DEFAULTS: Record<string, string> = {
  store_name: "Jardinia France",
  store_email: "contact@jardinia.fr",
  store_phone: "",
  shipping_cost: "4.99",
  shipping_free_threshold: "79",
  vat_rate: "20",
  maintenance_mode: "false",
  instagram_url: "",
  facebook_url: "",
  youtube_url: "",
};

export default function SettingsForm({ initial }: Props) {
  const [values, setValues] = useState<Record<string, string>>({ ...DEFAULTS, ...initial });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      toast.success("Paramètres sauvegardés");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const field = (key: string, label: string, type = "text", placeholder = "") => (
    <div>
      <label className="text-sm font-medium text-anthracite-700 block mb-1">{label}</label>
      <input
        type={type}
        value={values[key] ?? ""}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className="input w-full"
      />
    </div>
  );

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Boutique */}
      <section className="card p-6 space-y-4">
        <h2 className="font-semibold text-anthracite-800 text-base border-b pb-3 border-gray-100">Informations boutique</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field("store_name", "Nom de la boutique", "text", "Jardinia France")}
          {field("store_email", "Email de contact", "email", "contact@jardinia.fr")}
          {field("store_phone", "Téléphone", "tel", "+33 1 23 45 67 89")}
        </div>
      </section>

      {/* Livraison */}
      <section className="card p-6 space-y-4">
        <h2 className="font-semibold text-anthracite-800 text-base border-b pb-3 border-gray-100">Livraison & tarifs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-anthracite-700 block mb-1">Frais de livraison (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={values.shipping_cost ?? "4.99"}
              onChange={(e) => set("shipping_cost", e.target.value)}
              className="input w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-anthracite-700 block mb-1">Livraison gratuite dès (€)</label>
            <input
              type="number"
              step="1"
              min="0"
              value={values.shipping_free_threshold ?? "79"}
              onChange={(e) => set("shipping_free_threshold", e.target.value)}
              className="input w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-anthracite-700 block mb-1">Taux TVA (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={values.vat_rate ?? "20"}
              onChange={(e) => set("vat_rate", e.target.value)}
              className="input w-full"
            />
          </div>
        </div>
      </section>

      {/* Réseaux sociaux */}
      <section className="card p-6 space-y-4">
        <h2 className="font-semibold text-anthracite-800 text-base border-b pb-3 border-gray-100">Réseaux sociaux</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {field("instagram_url", "Instagram", "url", "https://instagram.com/...")}
          {field("facebook_url", "Facebook", "url", "https://facebook.com/...")}
          {field("youtube_url", "YouTube", "url", "https://youtube.com/...")}
        </div>
      </section>

      {/* Mode maintenance */}
      <section className="card p-6">
        <h2 className="font-semibold text-anthracite-800 text-base border-b pb-3 border-gray-100 mb-4">Maintenance</h2>
        <label className="flex items-center gap-3 cursor-pointer w-fit">
          <div
            onClick={() => set("maintenance_mode", values.maintenance_mode === "true" ? "false" : "true")}
            className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 cursor-pointer ${
              values.maintenance_mode === "true" ? "bg-red-500" : "bg-gray-200"
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${values.maintenance_mode === "true" ? "translate-x-5" : "translate-x-0"}`} />
          </div>
          <span className="text-sm font-medium text-anthracite-700">Mode maintenance activé</span>
          {values.maintenance_mode === "true" && (
            <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Le site est inaccessible aux visiteurs</span>
          )}
        </label>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary px-6 py-2.5 flex items-center gap-2 disabled:opacity-50"
        >
          {saved ? (
            <><Check size={16} /> Sauvegardé</>
          ) : (
            <><Save size={16} /> {saving ? "Sauvegarde..." : "Sauvegarder les paramètres"}</>
          )}
        </button>
      </div>
    </form>
  );
}
