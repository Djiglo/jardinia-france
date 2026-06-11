import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopHeader from "@/components/shop/ShopHeader";
import ProductGrid from "@/components/shop/ProductGrid";

export default async function CategoryPage({ params, searchParams }: any) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  
  const category = resolvedParams.category;
  const page = resolvedSearch.page ?? "1";
  const sort = resolvedSearch.sort ?? "newest";
  const brand = resolvedSearch.brand;
  const minPrice = resolvedSearch.minPrice;
  const maxPrice = resolvedSearch.maxPrice;
  const promo = resolvedSearch.promo;
  const inStock = resolvedSearch.inStock;

  const cat = await prisma.category.findUnique({ where: { slug: category } });
  if (!cat) notFound();

  const currentPage = parseInt(page);
  const perPage = 24;

  const where: any = { isActive: true, category: { slug: category } };
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
    averageRating: p.reviews.length > 0 ? p.reviews.reduce((a, r) => a + r.rating, 0) / p.reviews.length : null,
    reviewCount: p._count.reviews,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{cat.name}</h1>
      <div className="flex gap-8">
        <ShopFilters
          categories={categories}
          brands={brands}
          currentFilters={{ brand, minPrice, maxPrice, promo, inStock }}
        />
        <div className="flex-1 min-w-0">
          <ShopHeader total={total} currentSort={sort} />
          <ProductGrid
            products={enriched}
            total={total}
            page={currentPage}
            perPage={perPage}
            basePath={`/boutique/${category}`}
          />
        </div>
      </div>
    </div>
  );
}
