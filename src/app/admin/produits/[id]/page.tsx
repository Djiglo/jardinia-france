import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

interface Props { params: Promise<{ id: string }> }

export default async function EditProduitPage({ params }: Props) {
  const { id } = await params;

  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images:     { orderBy: { sortOrder: "asc" } },
        attributes: true,
        category:   true,
        brand:      true,
      },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.brand.findMany(   { where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-anthracite-900 mb-1">Modifier le produit</h1>
      <p className="text-sm text-gray-400 mb-6">{product.name}</p>
      <ProductForm product={product} categories={categories} brands={brands} />
    </div>
  );
}
