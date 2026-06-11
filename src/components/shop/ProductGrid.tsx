import Link from "next/link";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  images: { url: string; alt: string | null }[];
  category: { name: string; slug: string };
  _avg?: { rating: number | null };
  _count?: { reviews: number };
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
}

interface ProductGridProps {
  products: Product[];
  total: number;
  page: number;
  perPage: number;
  basePath?: string;
}

export default function ProductGrid({
  products,
  total,
  page,
  perPage,
  basePath = "/boutique",
}: ProductGridProps) {
  const totalPages = Math.ceil(total / perPage);

  const buildPageUrl = (p: number) => {
    // Preserve current search params and update page
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("page", String(p));
      return `${basePath}?${params.toString()}`;
    }
    return `${basePath}?page=${p}`;
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">🌱</div>
        <h3 className="text-lg font-semibold text-anthracite-700 mb-2">
          Aucun produit trouvé
        </h3>
        <p className="text-gray-500 mb-6">
          Essayez de modifier vos filtres ou votre recherche.
        </p>
        <Link href="/boutique" className="btn-primary">
          Voir tous les produits
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Grille */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              averageRating: product._avg?.rating ?? null,
              reviewCount: product._count?.reviews ?? 0,
            }}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-center gap-1 mt-10"
          aria-label="Pagination"
        >
          {page > 1 && (
            <Link
              href={buildPageUrl(page - 1)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              aria-label="Page précédente"
            >
              <ChevronLeft size={20} />
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isActive = p === page;
            const isNearby = Math.abs(p - page) <= 2;
            const isEndpoint = p === 1 || p === totalPages;

            if (!isNearby && !isEndpoint) {
              if (p === page - 3 || p === page + 3) {
                return (
                  <span key={p} className="px-2 text-gray-400">
                    …
                  </span>
                );
              }
              return null;
            }

            return (
              <Link
                key={p}
                href={buildPageUrl(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {p}
              </Link>
            );
          })}

          {page < totalPages && (
            <Link
              href={buildPageUrl(page + 1)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              aria-label="Page suivante"
            >
              <ChevronRight size={20} />
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
