import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage = Math.max(1, Math.min(48, parseInt(searchParams.get("perPage") ?? "24") || 24));
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
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await req.json();
    const { images = [], attributes = [], ...raw } = body;

    if (!raw.name || !raw.price || !raw.categoryId || !raw.sku) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const slug = raw.slug || slugify(raw.name);
    const existing = await prisma.product.findFirst({ where: { OR: [{ slug }, { sku: raw.sku }] } });
    if (existing) return NextResponse.json({ error: "Ce SKU ou slug est déjà utilisé par un autre produit." }, { status: 409 });

    const product = await prisma.product.create({
      data: {
        name:             raw.name,
        slug,
        sku:              raw.sku,
        shortDescription: raw.shortDescription || null,
        description:      raw.description,
        price:            parseFloat(raw.price),
        compareAtPrice:   raw.compareAtPrice ? parseFloat(raw.compareAtPrice) : null,
        costPrice:        raw.costPrice       ? parseFloat(raw.costPrice)      : null,
        stock:            parseInt(raw.stock ?? "0") || 0,
        categoryId:       raw.categoryId,
        brandId:          raw.brandId || null,
        isActive:         Boolean(raw.isActive ?? true),
        isFeatured:       Boolean(raw.isFeatured),
        isNew:            Boolean(raw.isNew),
        isBestSeller:     Boolean(raw.isBestSeller),
        tags:             Array.isArray(raw.tags) ? raw.tags : (raw.tags ? raw.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []),
        metaTitle:        raw.metaTitle        || null,
        metaDescription:  raw.metaDescription  || null,
        images: {
          create: (images as string[]).map((url, i) => ({
            url, sortOrder: i, isPrimary: i === 0,
          })),
        },
        attributes: {
          create: (attributes as { name: string; value: string }[]).filter((a) => a.name && a.value),
        },
      },
      include: { images: true, attributes: true, category: true },
    });

    revalidatePath("/");
    revalidatePath("/boutique");

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/products]", error);
    const msg = error?.meta?.target
      ? `Conflit : ${error.meta.target} déjà utilisé par un autre produit.`
      : (error?.message ?? "Erreur lors de la création");
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
