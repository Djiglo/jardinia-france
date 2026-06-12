import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage = Math.min(48, parseInt(searchParams.get("perPage") ?? "24"));
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const brand = searchParams.get("brand") ?? "";
  const minPrice = parseFloat(searchParams.get("minPrice") ?? "0") || 0;
  const maxPrice = parseFloat(searchParams.get("maxPrice") ?? "0") || 0;
  const promo = searchParams.get("promo") === "true";
  const inStock = searchParams.get("inStock") === "true";
  const minRating = parseFloat(searchParams.get("minRating") ?? "0") || 0;
  const sort = searchParams.get("sort") ?? "newest";

  const where: any = { isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { shortDescription: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category) where.category = { slug: category };
  if (brand) where.brand = { name: { contains: brand, mode: "insensitive" } };
  if (minPrice > 0) where.price = { ...(where.price ?? {}), gte: minPrice };
  if (maxPrice > 0) where.price = { ...(where.price ?? {}), lte: maxPrice };
  if (promo) where.compareAtPrice = { not: null };
  if (inStock) where.stock = { gt: 0 };

  const orderBy: any =
    sort === "price-asc" ? { price: "asc" }
    : sort === "price-desc" ? { price: "desc" }
    : sort === "name-asc" ? { name: "asc" }
    : sort === "popular" ? { isBestSeller: "desc" }
    : sort === "rating" ? { reviews: { _count: "desc" } }
    : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: true,
        brand: true,
        _count: { select: { reviews: true } },
        reviews: { select: { rating: true }, where: { status: "APPROVED" } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const enriched = products.map((p) => ({
    ...p,
    averageRating: p.reviews.length > 0 ? p.reviews.reduce((a, r) => a + r.rating, 0) / p.reviews.length : null,
    reviews: undefined,
  }));

  return NextResponse.json({ products: enriched, total, page, perPage, totalPages: Math.ceil(total / perPage) });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();
  const { images = [], attributes = [], ...data } = body;

  if (!data.name || !data.price || !data.categoryId || !data.sku) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }

  if (!data.brandId) data.brandId = null;
  const slug = data.slug || slugify(data.name);
  const existing = await prisma.product.findFirst({ where: { OR: [{ slug }, { sku: data.sku }] } });
  if (existing) return NextResponse.json({ error: "Slug ou SKU déjà utilisé" }, { status: 409 });

  const product = await prisma.product.create({
    data: {
      ...data,
      slug,
      price: parseFloat(data.price),
      compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
      costPrice: data.costPrice ? parseFloat(data.costPrice) : null,
      stock: parseInt(data.stock ?? "0"),
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []),
      images: {
        create: images.map((url: string, i: number) => ({
          url, sortOrder: i, isPrimary: i === 0,
        })),
      },
      attributes: {
        create: attributes.filter((a: any) => a.name && a.value),
      },
    },
    include: { images: true, attributes: true, category: true },
  });

  return NextResponse.json(product, { status: 201 });
}
