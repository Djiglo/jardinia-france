import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductPageClient from "@/components/shop/ProductPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      brand: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: {},
      attributes: true,
      reviews: {
        where: { status: "APPROVED" },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      _count: { select: { reviews: true } },
    },
  });
}

async function getRelatedProducts(categoryId: string, excludeId: string) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId }, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: true,
      _count: { select: { reviews: true } },
    },
    take: 4,
    orderBy: { isFeatured: "desc" },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Produit introuvable" };

  return {
    title: `${product.name} | Jardinia France`,
    description: product.shortDescription ?? product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? "",
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);

  // Calcul note moyenne
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : null;

  return (
    <ProductPageClient
      product={{ ...product, avgRating, reviewCount: product._count.reviews }}
      relatedProducts={related}
    />
  );
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return products.map((p) => ({ slug: p.slug }));
}