import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Plus, Package, TrendingDown, CheckCircle, XCircle, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Suspense } from "react";
import ProductFilters from "./ProductFilters";
import ProductActions from "./ProductActions";

interface Props {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
    sort?: string;
    order?: string;
    status?: string;
    stock?: string;
  }>;
}

const SORT_MAP: Record<string, any> = {
  name:      (o: string) => ({ name: o }),
  price:     (o: string) => ({ price: o }),
  stock:     (o: string) => ({ stock: o }),
  createdAt: (o: string) => ({ createdAt: o }),
};

function SortHeader({
  label, field, currentSort, currentOrder, base,
}: {
  label: string; field: string; currentSort: string; currentOrder: string; base: string;
}) {
  const active = currentSort === field;
  const nextOrder = active && currentOrder === "asc" ? "desc" : "asc";
  const href = `${base}&sort=${field}&order=${nextOrder}`;
  return (
    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
      <Link href={href} className="inline-flex items-center gap-1 hover:text-gray-800 transition-colors">
        {label}
        {active ? (
          currentOrder === "asc" ? <ChevronUp size={13} className="text-primary-600" /> : <ChevronDown size={13} className="text-primary-600" />
        ) : (
          <ChevronsUpDown size={13} className="text-gray-300" />
        )}
      </Link>
    </th>
  );
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const { page = "1", category = "", search = "", sort = "createdAt", order = "desc", status = "", stock: stockFilter = "" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page));
  const perPage = 15;

  const where: any = {};
  if (category) where.category = { slug: category };
  if (search) where.OR = [
    { name: { contains: search, mode: "insensitive" } },
    { sku:  { contains: search, mode: "insensitive" } },
  ];
  if (status === "active")   where.isActive = true;
  if (status === "inactive") where.isActive = false;
  if (stockFilter === "instock")  where.stock = { gt: 0 };
  if (stockFilter === "rupture")  where.stock = { lte: 0 };
  if (stockFilter === "low")      where.stock = { gt: 0, lte: 5 };

  const orderBy = SORT_MAP[sort] ? SORT_MAP[sort](order) : { createdAt: "desc" };

  const [products, total, categories, statsRaw] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
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
    prisma.product.aggregate({
      _count: { _all: true },
      where: {},
    }),
  ]);

  const [activeCount, outOfStockCount] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { stock: { lte: 0 } } }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  // Base URL for sort links (preserves current filters)
  const filterBase = `/admin/produits?page=1${category ? `&category=${category}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}${status ? `&status=${status}` : ""}${stockFilter ? `&stock=${stockFilter}` : ""}`;
  const pageBase = `/admin/produits?${category ? `category=${category}&` : ""}${search ? `search=${encodeURIComponent(search)}&` : ""}${status ? `status=${status}&` : ""}${stockFilter ? `stock=${stockFilter}&` : ""}sort=${sort}&order=${order}`;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-anthracite-900 flex items-center gap-2">
          <Package size={22} /> Produits
        </h1>
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={16} /> Nouveau produit
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total produits" value={statsRaw._count._all} icon={<Package size={18} />} color="blue" />
        <StatCard label="Actifs" value={activeCount} icon={<CheckCircle size={18} />} color="green" />
        <StatCard label="Inactifs" value={statsRaw._count._all - activeCount} icon={<XCircle size={18} />} color="gray" />
        <StatCard label="Rupture de stock" value={outOfStockCount} icon={<TrendingDown size={18} />} color="red" />
      </div>

      {/* Filtres */}
      <Suspense fallback={<div className="h-16 bg-white rounded-2xl border border-gray-100 animate-pulse" />}>
        <ProductFilters categories={categories} />
      </Suspense>

      {/* Résultats info */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {total === 0 ? "Aucun produit trouvé" : `${(currentPage - 1) * perPage + 1}–${Math.min(currentPage * perPage, total)} sur ${total} produit${total > 1 ? "s" : ""}`}
        </span>
        {total > 0 && <span>Page {currentPage} sur {totalPages}</span>}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide w-14">Image</th>
                <SortHeader label="Produit"   field="name"      currentSort={sort} currentOrder={order} base={filterBase} />
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Catégorie</th>
                <SortHeader label="Prix"      field="price"     currentSort={sort} currentOrder={order} base={filterBase} />
                <SortHeader label="Stock"     field="stock"     currentSort={sort} currentOrder={order} base={filterBase} />
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Avis</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Statut</th>
                <SortHeader label="Ajouté le" field="createdAt" currentSort={sort} currentOrder={order} base={filterBase} />
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-gray-400">
                    <Package size={32} className="mx-auto mb-2 opacity-30" />
                    Aucun produit ne correspond à vos filtres
                  </td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/70 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      {product.images[0] ? (
                        <Image src={product.images[0].url} alt="" width={44} height={44} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package size={18} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-anthracite-800 max-w-[220px] truncate group-hover:text-primary-700 transition-colors">{product.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{product.sku}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{product.category.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-anthracite-800">{formatPrice(Number(product.price))}</p>
                    {product.compareAtPrice && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(Number(product.compareAtPrice))}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StockBadge stock={product.stock} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-center">{product._count.reviews}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${product.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                      {product.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(product.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <ProductActions productId={product.id} productName={product.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <Link
              href={`${pageBase}&page=${currentPage - 1}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage <= 1 ? "text-gray-300 pointer-events-none" : "text-gray-600 hover:bg-white hover:shadow-sm"}`}
            >
              ← Précédent
            </Link>
            <div className="flex items-center gap-1">
              {buildPageRange(currentPage, totalPages).map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="w-8 text-center text-gray-400 text-sm">…</span>
                ) : (
                  <Link
                    key={p}
                    href={`${pageBase}&page=${p}`}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      p === currentPage ? "bg-primary-600 text-white shadow-sm" : "text-gray-600 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    {p}
                  </Link>
                )
              )}
            </div>
            <Link
              href={`${pageBase}&page=${currentPage + 1}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage >= totalPages ? "text-gray-300 pointer-events-none" : "text-gray-600 hover:bg-white hover:shadow-sm"}`}
            >
              Suivant →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: "blue" | "green" | "gray" | "red" }) {
  const colors = {
    blue:  "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    gray:  "bg-gray-100 text-gray-500",
    red:   "bg-red-50 text-red-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
      <div className={`p-2 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-xl font-bold text-anthracite-900">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">Rupture</span>;
  if (stock <= 5)  return <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">{stock} restants</span>;
  return <span className="text-xs font-medium text-green-700">{stock}</span>;
}

function buildPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}
