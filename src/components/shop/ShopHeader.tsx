"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface ShopHeaderProps {
  total: number;
  currentSort: string;
  searchQuery?: string;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Nouveautés" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "rating", label: "Meilleures notes" },
  { value: "popular", label: "Popularité" },
  { value: "name-asc", label: "Nom A→Z" },
];

export default function ShopHeader({ total, currentSort, searchQuery }: ShopHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200">
      <div>
        <h1 className="text-xl font-semibold text-anthracite-800">
          {searchQuery ? `Résultats pour "${searchQuery}"` : "Tous nos produits"}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {total} produit{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap">
          Trier par :
        </label>
        <select
          id="sort"
          value={currentSort}
          onChange={(e) => handleSort(e.target.value)}
          className="input text-sm py-1.5 pr-8"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
