import { prisma } from "@/lib/prisma";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopHeader from "@/components/shop/ShopHeader";
import ProductGrid from "@/components/shop/ProductGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique | Jardinia France",
  description: "Découvrez toute notre gamme de produits pour aménager et entretenir votre jardin : piscines, pergolas, mobilier de jardin, barbecues, tondeuses et outils de jardin. Livraison gratuite dès 79 €.",
  openGraph: {
    title: "Boutique — Jardinia France",
    description: "Tous nos produits jardin avec livraison gratuite dès 79 €.",
  },
};

export default async function BoutiquePage({ searchParams }: any) {
  const sp = await searchParams;
  const page = sp.page ?? "1";
  const sort = sp.sort ?? "newest";
  const search = sp.search;
  const category = sp.category;
  const brand = sp.brand;
  const minPrice = sp.minPrice;
  const maxPrice = sp.maxPrice;
  const promo = sp.promo;
  const inStock = sp.inStock;

  const currentPage = parseInt(page);
  const perPage = 24;

  const where: any = { isActive: true };
  if (search) where.OR = [
    { name: { contains: search, mode: "insensitive" } },
    { shortDescription: { contains: search, mode: "insensitive" } },
  ];
  if (category) where.category = { slug: category };
  if (brand) where.brand = { name: { contains: brand, mode: "insensitive" } };
  if (minPrice) where.price = { ...(where.price ?? {}), gte: parseFloat(minPrice) };
  if (maxPrice) where.price = { ...(where.price ?? {}), lte: parseFloat(maxPrice) };
  if (promo === "true") where.compareAtPrice = { not: null };
  if (inStock === "true") where.stock = { gt: 0 };

  const orderBy: any =
    sort === "price-asc" ? { price: "asc" }
    : sort === "price-desc" ? { price: "desc" }
    : sort === "name-asc" ? { name: "asc" }
    : sort === "popular" ? { isBestSeller: "desc" }
    : { createdAt: "desc" };

  const [products, total, brands, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (currentPage - 1) * perPage,
      take: perPage,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: true,
        _count: { select: { reviews: true } },
        reviews: { select: { rating: true }, where: { status: "APPROVED" } },
      },
    }),
    prisma.product.count({ where }),
    prisma.brand.findMany({ include: { _count: { select: { products: true } } } }),
    prisma.category.findMany({ include: { _count: { select: { products: true } } } }),
  ]);

  const enriched = products.map((p) => ({
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice != null ? Number(p.compareAtPrice) : null,
    costPrice: p.costPrice != null ? Number(p.costPrice) : null,
    averageRating: p.reviews.length > 0 ? p.reviews.reduce((a, r) => a + r.rating, 0) / p.reviews.length : null,
    reviewCount: p._count.reviews,
  })) as any;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <ShopFilters
          categories={categories}
          brands={brands}
          currentFilters={{ category, brand, minPrice, maxPrice, promo, inStock }}
        />
        <div className="flex-1 min-w-0">
          <ShopHeader total={total} currentSort={sort} searchQuery={search} />
          <ProductGrid
            products={enriched}
            total={total}
            page={currentPage}
            perPage={perPage}
            basePath="/boutique"
            searchParamsStr={new URLSearchParams(
              Object.fromEntries(Object.entries(sp).filter(([, v]) => v !== undefined)) as Record<string, string>
            ).toString()}
          />
        </div>
      </div>
    </div>
  );
}
