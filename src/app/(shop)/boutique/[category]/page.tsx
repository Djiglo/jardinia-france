import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopHeader from "@/components/shop/ShopHeader";
import ProductGrid from "@/components/shop/ProductGrid";

interface Props {
  params:       Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = await prisma.category.findUnique({ where: { slug: category } });
  if (!cat) return { title: "Catégorie introuvable" };

  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://jardinia-france.vercel.app";

  return {
    title:       `${cat.name} | Jardinia France`,
    description: `Découvrez notre sélection de ${cat.name.toLowerCase()} : livraison gratuite dès 79 €, retours faciles, paiement sécurisé.`,
    alternates:  { canonical: `${BASE_URL}/boutique/${category}` },
    openGraph: {
      title:       `${cat.name} — Jardinia France`,
      description: `Tous nos produits ${cat.name.toLowerCase()} avec livraison gratuite dès 79 €.`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category }     = await params;
  const resolvedSearch   = await searchParams;

  const page     = resolvedSearch.page     ?? "1";
  const sort     = resolvedSearch.sort     ?? "newest";
  const type     = resolvedSearch.type;
  const brand    = resolvedSearch.brand;
  const minPrice = resolvedSearch.minPrice;
  const maxPrice = resolvedSearch.maxPrice;
  const promo    = resolvedSearch.promo;
  const inStock  = resolvedSearch.inStock;

  const cat = await prisma.category.findUnique({ where: { slug: category } });
  if (!cat) notFound();

  const currentPage = parseInt(page);
  const perPage     = 24;

  const where: any = { isActive: true, category: { slug: category } };
  if (type)              where.tags        = { has: type };
  if (brand)             where.brand       = { name: { contains: brand, mode: "insensitive" } };
  if (minPrice)          where.price       = { ...(where.price ?? {}), gte: parseFloat(minPrice) };
  if (maxPrice)          where.price       = { ...(where.price ?? {}), lte: parseFloat(maxPrice) };
  if (promo === "true")  where.compareAtPrice = { not: null };
  if (inStock === "true") where.stock      = { gt: 0 };

  const orderBy: any =
    sort === "price-asc"  ? { price: "asc" }
    : sort === "price-desc" ? { price: "desc" }
    : sort === "name-asc"   ? { name: "asc" }
    : sort === "popular"    ? { isBestSeller: "desc" }
    : { createdAt: "desc" };

  const [products, total, brands, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (currentPage - 1) * perPage,
      take: perPage,
      include: {
        images:   { orderBy: { sortOrder: "asc" }, take: 1 },
        category: true,
        _count:   { select: { reviews: true } },
        reviews:  { select: { rating: true }, where: { status: "APPROVED" } },
      },
    }),
    prisma.product.count({ where }),
    prisma.brand.findMany({ include: { _count: { select: { products: true } } } }),
    prisma.category.findMany({ include: { _count: { select: { products: true } } } }),
  ]);

  const enriched = products.map((p) => ({
    ...p,
    price:          Number(p.price),
    compareAtPrice: p.compareAtPrice != null ? Number(p.compareAtPrice) : null,
    costPrice:      p.costPrice != null ? Number(p.costPrice) : null,
    averageRating:  p.reviews.length > 0 ? p.reviews.reduce((a, r) => a + r.rating, 0) / p.reviews.length : null,
    reviewCount:    p._count.reviews,
  })) as any;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <ShopFilters
          categories={categories}
          brands={brands}
          currentFilters={{ brand, minPrice, maxPrice, promo, inStock }}
        />
        <div className="flex-1 min-w-0">
          <ShopHeader
            total={total}
            currentSort={sort}
            categoryName={type ? `${cat.name} — ${type}` : cat.name}
          />
          <ProductGrid
            products={enriched}
            total={total}
            page={currentPage}
            perPage={perPage}
            basePath={`/boutique/${category}`}
            searchParamsStr={new URLSearchParams(
              Object.fromEntries(
                Object.entries(resolvedSearch).filter(([, v]) => v !== undefined)
              ) as Record<string, string>
            ).toString()}
          />
        </div>
      </div>
    </div>
  );
}
