"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface Address {
  id: string; firstName: string; lastName: string; company: string | null;
  address1: string; address2: string | null; city: string; postalCode: string;
  country: string; phone: string | null; isDefault: boolean;
}

const EMPTY: Omit<Address, "id" | "isDefault"> = {
  firstName: "", lastName: "", company: "", address1: "", address2: "",
  city: "", postalCode: "", country: "FR", phone: "",
};

export default function AddressManager({ addresses: initial }: { addresses: Address[] }) {
  const router = useRouter();
  const [addresses, setAddresses] = useState(initial);
  const [editing, setEditing] = useState<Address | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openAdd = () => { setForm(EMPTY); setAdding(true); setEditing(null); setError(""); };
  const openEdit = (a: Address) => { setForm({ ...a }); setEditing(a); setAdding(false); setError(""); };
  const closeForm = () => { setAdding(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.firstName || !form.lastName || !form.address1 || !form.city || !form.postalCode) {
      setError("Veuillez remplir tous les champs obligatoires."); return;
    }
    setLoading(true); setError("");
    try {
      const url = editing ? `/api/account/addresses/${editing.id}` : "/api/account/addresses";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { setError("Erreur lors de l'enregistrement."); return; }
      closeForm(); router.refresh();
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette adresse ?")) return;
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = async (id: string) => {
    await fetch(`/api/account/addresses/${id}/default`, { method: "POST" });
    router.refresh();
  };

  const field = (key: keyof typeof form, label: string, required = false, half = false) => (
    <div className={half ? "" : "col-span-2"}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && " *"}</label>
      <input
        value={(form as any)[key] ?? ""}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm px-4 py-2.5">
        <Plus size={16} /> Ajouter une adresse
      </button>

      {(adding || editing) && (
        <div className="card p-6">
          <h2 className="font-semibold text-anthracite-800 mb-4">{editing ? "Modifier l'adresse" : "Nouvelle adresse"}</h2>
          <div className="grid grid-cols-2 gap-3">
            {field("firstName", "Prénom", true, true)}
            {field("lastName", "Nom", true, true)}
            {field("company", "Société")}
            {field("address1", "Adresse", true)}
            {field("address2", "Complément")}
            {field("postalCode", "Code postal", true, true)}
            {field("city", "Ville", true, true)}
            {field("phone", "Téléphone")}
          </div>
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} disabled={loading} className="btn-primary px-5 py-2.5 text-sm">
              {loading ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button onClick={closeForm} className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl">
              Annuler
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 && !adding ? (
        <div className="card p-8 text-center text-gray-400">
          <p>Aucune adresse enregistrée.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className={`card p-4 relative ${addr.isDefault ? "border-primary-200 bg-primary-50/30" : ""}`}>
              {addr.isDefault && (
                <span className="absolute top-3 right-3 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Star size={10} fill="currentColor" /> Par défaut
                </span>
              )}
              <address className="not-italic text-sm text-gray-700 space-y-0.5 mb-4">
                <p className="font-semibold text-anthracite-800">{addr.firstName} {addr.lastName}</p>
                {addr.company && <p className="text-gray-500">{addr.company}</p>}
                <p>{addr.address1}</p>
                {addr.address2 && <p>{addr.address2}</p>}
                <p>{addr.postalCode} {addr.city}</p>
                {addr.phone && <p className="text-gray-500">{addr.phone}</p>}
              </address>
              <div className="flex gap-2 text-xs">
                <button onClick={() => openEdit(addr)} className="flex items-center gap-1 text-gray-500 hover:text-primary-600 transition-colors">
                  <Edit2 size={12} /> Modifier
                </button>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id)} className="flex items-center gap-1 text-gray-500 hover:text-primary-600 transition-colors">
                    <Star size={12} /> Définir par défaut
                  </button>
                )}
                <button onClick={() => handleDelete(addr.id)} className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors ml-auto">
                  <Trash2 size={12} /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
