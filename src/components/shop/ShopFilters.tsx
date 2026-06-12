"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from "lucide-react";

interface Category { id: string; name: string; slug: string; _count: { products: number } }
interface Brand { id: string; name: string; _count: { products: number } }

interface ShopFiltersProps {
  categories: Category[];
  brands: Brand[];
  currentFilters: {
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    promo?: string;
    inStock?: string;
  };
}

export default function ShopFilters({ categories, brands, currentFilters }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    brands: true,
    promo: true,
    stock: true,
  });

  const [priceMin, setPriceMin] = useState(currentFilters.minPrice || "");
  const [priceMax, setPriceMax] = useState(currentFilters.maxPrice || "");
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = (section: keyof typeof openSections) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`/boutique?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = () => {
    setPriceMin("");
    setPriceMax("");
    router.push("/boutique");
  };

  const hasFilters =
    currentFilters.category ||
    currentFilters.brand ||
    currentFilters.minPrice ||
    currentFilters.maxPrice ||
    currentFilters.promo ||
    currentFilters.inStock;

  const applyPrice = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (priceMin) params.set("minPrice", priceMin); else params.delete("minPrice");
    if (priceMax) params.set("maxPrice", priceMax); else params.delete("maxPrice");
    router.push(`/boutique?${params.toString()}`);
  };

  const FilterContent = () => (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-anthracite-800 text-lg flex items-center gap-2">
          <SlidersHorizontal size={18} />
          Filtres
        </h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <X size={12} />
            Tout effacer
          </button>
        )}
      </div>

      {/* Catégories */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggle("categories")}
          className="w-full flex items-center justify-between py-2 font-medium text-anthracite-700 hover:text-primary-600"
        >
          Catégories
          {openSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.categories && (
          <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
            <button
              onClick={() => updateFilter("category", null)}
              className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${
                !currentFilters.category
                  ? "text-primary-600 font-medium bg-primary-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Toutes les catégories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateFilter("category", cat.slug)}
                className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors flex justify-between items-center ${
                  currentFilters.category === cat.slug
                    ? "text-primary-600 font-medium bg-primary-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs text-gray-400">({cat._count.products})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Prix */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggle("price")}
          className="w-full flex items-center justify-between py-2 font-medium text-anthracite-700 hover:text-primary-600"
        >
          Prix
          {openSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.price && (
          <div className="mt-2 space-y-3">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min €"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="input text-sm py-1.5 w-full"
                min="0"
              />
              <span className="text-gray-400">—</span>
              <input
                type="number"
                placeholder="Max €"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="input text-sm py-1.5 w-full"
                min="0"
              />
            </div>
            <button onClick={applyPrice} className="btn-primary w-full text-sm py-1.5">
              Appliquer
            </button>
          </div>
        )}
      </div>

      {/* Marques */}
      {brands.length > 0 && (
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggle("brands")}
            className="w-full flex items-center justify-between py-2 font-medium text-anthracite-700 hover:text-primary-600"
          >
            Marques
            {openSections.brands ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSections.brands && (
            <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <label key={brand.id} className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={currentFilters.brand === brand.name}
                    onChange={(e) => updateFilter("brand", e.target.checked ? brand.name : null)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 flex-1">{brand.name}</span>
                  <span className="text-xs text-gray-400">({brand._count.products})</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Promotions */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggle("promo")}
          className="w-full flex items-center justify-between py-2 font-medium text-anthracite-700 hover:text-primary-600"
        >
          Promotions
          {openSections.promo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.promo && (
          <label className="flex items-center gap-2 cursor-pointer mt-2 px-2 py-1 rounded hover:bg-gray-50">
            <input
              type="checkbox"
              checked={currentFilters.promo === "true"}
              onChange={(e) => updateFilter("promo", e.target.checked ? "true" : null)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600">En promotion uniquement</span>
          </label>
        )}
      </div>

      {/* Disponibilité */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggle("stock")}
          className="w-full flex items-center justify-between py-2 font-medium text-anthracite-700 hover:text-primary-600"
        >
          Disponibilité
          {openSections.stock ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.stock && (
          <label className="flex items-center gap-2 cursor-pointer mt-2 px-2 py-1 rounded hover:bg-gray-50">
            <input
              type="checkbox"
              checked={currentFilters.inStock === "true"}
              onChange={(e) => updateFilter("inStock", e.target.checked ? "true" : null)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600">En stock uniquement</span>
          </label>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="card p-4 sticky top-4">
          <FilterContent />
        </div>
      </aside>

      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="btn-outline flex items-center gap-2"
        >
          <SlidersHorizontal size={16} />
          Filtres
          {hasFilters && (
            <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-80 bg-white overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg">Filtres</span>
              <button onClick={() => setMobileOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <FilterContent />
            <button
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full mt-4"
            >
              Voir les résultats
            </button>
          </div>
        </div>
      )}
    </>
  );
}
