import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Plus, Package } from "lucide-react";
import { Suspense } from "react";
import ProductFilters from "./ProductFilters";
import ProductActions from "./ProductActions";

interface Props {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const { page = "1", category = "", search = "" } = await searchParams;
  const currentPage = parseInt(page);
  const perPage = 20;

  const where: any = {};
  if (category) where.category = { slug: category };
  if (search) where.name = { contains: search, mode: "insensitive" };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * perPage,
      take: perPage,
      include: {
        category: true,
        images: { take: 1, orderBy: { sortOrder: "asc" } },
        _count: { select: { reviews: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-anthracite-900 flex items-center gap-2">
          <Package size={22} /> Produits
          <span className="text-base font-normal text-gray-400">({total})</span>
        </h1>
        <Link href="/admin/produits/nouveau" className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium">
          <Plus size={16} /> Nouveau produit
        </Link>
      </div>

      {/* Filtres */}
      <Suspense fallback={<div className="h-16 bg-white rounded-2xl border border-gray-100 mb-5 animate-pulse" />}>
        <ProductFilters categories={categories} />
      </Suspense>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Image", "Produit", "Catégorie", "Prix", "Stock", "Avis", "Statut", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                      {product.images[0] ? (
                        <Image src={product.images[0].url} alt="" width={40} height={40} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package size={16} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-anthracite-700 max-w-[200px] truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.sku}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{product.category.name}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-anthracite-700">{formatPrice(Number(product.price))}</p>
                    {product.compareAtPrice && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(Number(product.compareAtPrice))}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${product.stock === 0 ? "text-red-500" : product.stock <= 5 ? "text-orange-500" : "text-green-600"}`}>
                      {product.stock === 0 ? "Rupture" : product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{product._count.reviews}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {product.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ProductActions productId={product.id} productName={product.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-1 p-4 border-t border-gray-100">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/produits?page=${p}${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${
                  p === currentPage ? "bg-primary-600 text-white" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
