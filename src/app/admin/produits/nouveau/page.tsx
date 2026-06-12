import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function NouveauProduitPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-anthracite-900 mb-6">Nouveau produit</h1>
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
