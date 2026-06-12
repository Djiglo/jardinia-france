"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useCallback, useRef } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
}

export default function ProductFilters({ categories }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  const nav = useCallback(
    (updates: Record<string, string>) => {
      const p = new URLSearchParams(params.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) p.set(key, value);
        else p.delete(key);
      });
      p.delete("page");
      router.push(`/admin/produits?${p.toString()}`);
    },
    [params, router]
  );

  const hasFilters = !!(params.get("search") || params.get("category") || params.get("status") || params.get("stock"));

  const clearAll = () => {
    if (formRef.current) formRef.current.reset();
    router.push("/admin/produits");
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Recherche */}
        <form
          ref={formRef}
          className="relative flex-1 min-w-[200px]"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            nav({ search: fd.get("search") as string });
          }}
        >
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            name="search"
            defaultValue={params.get("search") ?? ""}
            placeholder="Nom, SKU..."
            className="pl-9 pr-3 w-full border border-gray-200 rounded-xl py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-gray-50 focus:bg-white transition-colors"
          />
        </form>

        {/* Catégorie */}
        <select
          value={params.get("category") ?? ""}
          onChange={(e) => nav({ category: e.target.value })}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-gray-50 min-w-[160px]"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>

        {/* Statut */}
        <select
          value={params.get("status") ?? ""}
          onChange={(e) => nav({ status: e.target.value })}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-gray-50 min-w-[130px]"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>

        {/* Stock */}
        <select
          value={params.get("stock") ?? ""}
          onChange={(e) => nav({ stock: e.target.value })}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-gray-50 min-w-[150px]"
        >
          <option value="">Tout le stock</option>
          <option value="instock">En stock</option>
          <option value="low">Stock faible (≤ 5)</option>
          <option value="rupture">Rupture</option>
        </select>

        {/* Reset */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors border border-gray-200"
          >
            <X size={14} /> Effacer
          </button>
        )}
      </div>

      {/* Tags filtres actifs */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 pt-1">
          {params.get("search") && (
            <FilterTag label={`Recherche : "${params.get("search")}"`} onRemove={() => nav({ search: "" })} />
          )}
          {params.get("category") && (
            <FilterTag label={`Catégorie : ${categories.find(c => c.slug === params.get("category"))?.name ?? params.get("category")}`} onRemove={() => nav({ category: "" })} />
          )}
          {params.get("status") && (
            <FilterTag label={params.get("status") === "active" ? "Actif" : "Inactif"} onRemove={() => nav({ status: "" })} />
          )}
          {params.get("stock") && (
            <FilterTag
              label={{ instock: "En stock", low: "Stock faible", rupture: "Rupture" }[params.get("stock")!] ?? params.get("stock")!}
              onRemove={() => nav({ stock: "" })}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 border border-primary-200 text-xs px-2.5 py-1 rounded-full font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-primary-900 transition-colors ml-0.5">
        <X size={11} />
      </button>
    </span>
  );
}
