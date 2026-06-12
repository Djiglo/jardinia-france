"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, ArrowLeft, ImageIcon } from "lucide-react";
import { slugify } from "@/lib/utils";
import Image from "next/image";

interface Category { id: string; name: string }
interface Brand    { id: string; name: string }

interface Attribute { name: string; value: string }

interface ProductFormProps {
  product?: any;
  categories: Category[];
  brands: Brand[];
}

export default function ProductForm({ product, categories, brands }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name:             product?.name             ?? "",
    slug:             product?.slug             ?? "",
    sku:              product?.sku              ?? "",
    shortDescription: product?.shortDescription ?? "",
    description:      product?.description      ?? "",
    price:            product?.price?.toString() ?? "",
    compareAtPrice:   product?.compareAtPrice?.toString() ?? "",
    costPrice:        product?.costPrice?.toString()   ?? "",
    stock:            product?.stock?.toString()       ?? "0",
    categoryId:       product?.categoryId              ?? "",
    brandId:          product?.brandId                 ?? "",
    isActive:         product?.isActive   ?? true,
    isFeatured:       product?.isFeatured  ?? false,
    isNew:            product?.isNew       ?? false,
    isBestSeller:     product?.isBestSeller ?? false,
    tags:             product?.tags?.join(", ") ?? "",
    metaTitle:        product?.metaTitle        ?? "",
    metaDescription:  product?.metaDescription  ?? "",
  });

  const [images, setImages] = useState<string[]>(
    product?.images?.map((i: any) => i.url) ?? []
  );
  const [newImage, setNewImage] = useState("");

  const [attributes, setAttributes] = useState<Attribute[]>(
    product?.attributes ?? []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-slug depuis le nom
  const handleNameChange = (v: string) => {
    setForm((f) => ({
      ...f,
      name: v,
      slug: isEdit ? f.slug : slugify(v),
    }));
  };

  const addImage = () => {
    const url = newImage.trim();
    if (url && !images.includes(url)) {
      setImages((prev) => [...prev, url]);
      setNewImage("");
    }
  };

  const removeImage = (url: string) => setImages((prev) => prev.filter((u) => u !== url));

  const addAttribute = () => setAttributes((prev) => [...prev, { name: "", value: "" }]);
  const updateAttr = (i: number, key: "name" | "value", v: string) =>
    setAttributes((prev) => prev.map((a, idx) => idx === i ? { ...a, [key]: v } : a));
  const removeAttr = (i: number) => setAttributes((prev) => prev.filter((_, idx) => idx !== i));

  const toggle = (key: "isActive" | "isFeatured" | "isNew" | "isBestSeller") =>
    setForm((f) => ({ ...f, [key]: !f[key] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.sku || !form.price || !form.categoryId || !form.description) {
      setError("Veuillez remplir tous les champs obligatoires (*).");
      return;
    }

    setLoading(true);
    try {
      const url    = isEdit ? `/api/products/${product.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images, attributes }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l'enregistrement.");
        return;
      }

      router.push("/admin/produits");
      router.refresh();
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-3">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm">
            <Save size={16} /> {loading ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer le produit"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="xl:col-span-2 space-y-6">
          {/* Infos de base */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-anthracite-800 mb-4">Informations générales</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
                <input value={form.name} onChange={(e) => handleNameChange(e.target.value)} required className={inp} placeholder="Ex : Barbecue Weber Spirit II E-310" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={inp} placeholder="barbecue-weber-spirit" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                  <input value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} required className={inp} placeholder="WEB-SPIRIT-310" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description courte</label>
                <input value={form.shortDescription} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} className={inp} placeholder="Résumé affiché sur les cartes produit" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description complète *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  required
                  rows={6}
                  className={`${inp} resize-y`}
                  placeholder="Description détaillée du produit…"
                />
              </div>
            </div>
          </div>

          {/* Prix & Stock */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-anthracite-800 mb-4">Prix & Stock</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€) *</label>
                <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required className={inp} placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix barré (€)</label>
                <input type="number" step="0.01" min="0" value={form.compareAtPrice} onChange={(e) => setForm((f) => ({ ...f, compareAtPrice: e.target.value }))} className={inp} placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix coûtant (€)</label>
                <input type="number" step="0.01" min="0" value={form.costPrice} onChange={(e) => setForm((f) => ({ ...f, costPrice: e.target.value }))} className={inp} placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" min="0" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className={inp} placeholder="0" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-anthracite-800 mb-4 flex items-center gap-2"><ImageIcon size={16} /> Images</h2>
            <div className="flex gap-2 mb-4">
              <input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                placeholder="https://… (URL de l'image)"
                className={`${inp} flex-1`}
              />
              <button type="button" onClick={addImage} className="btn-primary px-4 py-2.5 text-sm flex items-center gap-1">
                <Plus size={14} /> Ajouter
              </button>
            </div>
            {images.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
                Aucune image — collez une URL ci-dessus
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {images.map((url, i) => (
                  <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                    <Image src={url} alt="" fill className="object-cover" unoptimized />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 text-xs bg-primary-600 text-white px-1.5 py-0.5 rounded font-medium">
                        Principale
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attributs */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-anthracite-800">Caractéristiques techniques</h2>
              <button type="button" onClick={addAttribute} className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                <Plus size={14} /> Ajouter
              </button>
            </div>
            {attributes.length === 0 ? (
              <p className="text-sm text-gray-400">Aucune caractéristique — ex : Puissance / 2000W</p>
            ) : (
              <div className="space-y-2">
                {attributes.map((attr, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input value={attr.name}  onChange={(e) => updateAttr(i, "name",  e.target.value)} placeholder="Nom (ex: Puissance)" className={`${inp} flex-1`} />
                    <input value={attr.value} onChange={(e) => updateAttr(i, "value", e.target.value)} placeholder="Valeur (ex: 2000W)"   className={`${inp} flex-1`} />
                    <button type="button" onClick={() => removeAttr(i)} className="text-red-400 hover:text-red-600 p-1.5">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-anthracite-800 mb-4">SEO</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre meta</label>
                <input value={form.metaTitle} onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))} className={inp} placeholder={form.name} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description meta</label>
                <textarea value={form.metaDescription} onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))} rows={2} className={`${inp} resize-none`} placeholder={form.shortDescription} />
              </div>
            </div>
          </div>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Statut */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-anthracite-800 mb-4">Statut & Visibilité</h2>
            <div className="space-y-3">
              {([
                { key: "isActive",    label: "Produit actif",       desc: "Visible sur la boutique"    },
                { key: "isFeatured",  label: "Mis en avant",        desc: "Section 'Produits vedettes'" },
                { key: "isNew",       label: "Nouveau",             desc: "Badge 'Nouveau'"             },
                { key: "isBestSeller",label: "Best-seller",         desc: "Section 'Meilleures ventes'" },
              ] as const).map(({ key, label, desc }) => (
                <label key={key} className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-anthracite-700">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${form[key] ? "bg-primary-600" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form[key] ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </label>
              ))}
            </div>
          </div>

          {/* Catégorie & Marque */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-anthracite-800 mb-4">Classification</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} required className={inp}>
                  <option value="">Sélectionner…</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                <select value={form.brandId} onChange={(e) => setForm((f) => ({ ...f, brandId: e.target.value }))} className={inp}>
                  <option value="">Aucune marque</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} className={inp} placeholder="jardin, été, promo (séparés par des virgules)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
