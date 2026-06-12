import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import ProductPageClient from "@/components/shop/ProductPageClient";

// ISR — pages produit rafraîchies toutes les 5 minutes
export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

// React.cache déduplique l'appel entre generateMetadata et ProductPage
const getProduct = cache(async (slug: string) =>
  prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category:   true,
      brand:      true,
      images:     { orderBy: { sortOrder: "asc" } },
      variants:   { where: { isActive: true }, orderBy: { position: "asc" } },
      attributes: true,
      reviews: {
        where:   { status: "APPROVED" },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take:    20,
      },
      _count: { select: { reviews: true } },
    },
  })
);

async function getRelatedProducts(categoryId: string, excludeId: string) {
  return prisma.product.findMany({
    where:   { categoryId, id: { not: excludeId }, isActive: true },
    include: {
      images:   { orderBy: { sortOrder: "asc" }, take: 1 },
      category: true,
      _count:   { select: { reviews: true } },
    },
    take:    4,
    orderBy: { isFeatured: "desc" },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Produit introuvable" };

  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://jardinia-france.vercel.app";

  return {
    title:       `${product.name} | Jardinia France`,
    description: product.shortDescription ?? product.description.replace(/<[^>]+>/g, "").slice(0, 155),
    alternates:  { canonical: `${BASE_URL}/boutique/produit/${slug}` },
    openGraph: {
      title:       product.name,
      description: product.shortDescription ?? "",
      images: product.images[0]
        ? [{ url: product.images[0].url, width: 1200, height: 630, alt: product.name }]
        : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product  = await getProduct(slug); // dédupliqué grâce à React.cache
  if (!product) notFound();

  // Lancer les produits similaires en parallèle
  const relatedRaw = await getRelatedProducts(product.categoryId, product.id);
  const related = relatedRaw.map((p) => ({
    ...p,
    price:          Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
  }));

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : null;

  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://jardinia-france.vercel.app";

  // JSON-LD Product Schema — rich results Google (étoiles, prix, disponibilité)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "Product",
    name:       product.name,
    description: product.shortDescription ?? "",
    sku:         product.sku,
    brand:       product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    image:       product.images.map((i) => i.url),
    url:         `${BASE_URL}/boutique/produit/${slug}`,
    offers: {
      "@type":       "Offer",
      price:         Number(product.price).toFixed(2),
      priceCurrency: "EUR",
      availability:  product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url:           `${BASE_URL}/boutique/produit/${slug}`,
    },
    ...(avgRating && product._count.reviews > 0 ? {
      aggregateRating: {
        "@type":       "AggregateRating",
        ratingValue:   avgRating.toFixed(1),
        reviewCount:   product._count.reviews,
        bestRating:    "5",
        worstRating:   "1",
      },
    } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageClient
        product={{
          ...product,
          price:          Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
          variants:       product.variants.map((v) => ({ ...v, price: Number(v.price) })),
          avgRating,
          reviewCount:    product._count.reviews,
        }}
        relatedProducts={related}
      />
    </>
  );
}

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where:  { isActive: true },
      select: { slug: true },
    });
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}
