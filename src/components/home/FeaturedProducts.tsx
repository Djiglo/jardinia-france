// ================================================
// JARDINIA FRANCE - Produits Vedettes
// ================================================
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { prisma } from "@/lib/prisma";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    take: 8,
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      brand: true,
      reviews: { where: { status: "APPROVED" }, select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (!products.length) return null;

  // Calcul note moyenne
  const enriched = products.map((p) => ({
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    taxRate: Number(p.taxRate),
    averageRating: p.reviews.length
      ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length
      : undefined,
    reviewCount: p.reviews.length,
    reviews: [],
    variants: [],
    attributes: [],
  }));

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">Produits vedettes</h2>
            <p className="section-subtitle mt-1">
              Notre sélection des meilleurs produits pour votre extérieur
            </p>
          </div>
          <Link
            href="/boutique?featured=true"
            className="hidden md:flex items-center gap-2 text-primary-600 font-medium hover:text-primary-800 transition-colors"
          >
            Voir tout <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {enriched.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/boutique?featured=true" className="btn-outline">
            Voir tous les produits <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
