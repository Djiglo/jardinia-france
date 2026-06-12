import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Heart } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";

export default async function FavorisPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        include: {
          images: { take: 1, orderBy: { sortOrder: "asc" } },
          category: true,
          _count: { select: { reviews: true } },
          reviews: { select: { rating: true }, where: { status: "APPROVED" } },
        },
      },
    },
  });

  const products = wishlist.map(({ product }) => ({
    ...product,
    averageRating: product.reviews.length > 0
      ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length
      : null,
    reviewCount: product._count.reviews,
  }));

  return (
    <div>
      <h1 className="text-xl font-bold text-anthracite-900 mb-6 flex items-center gap-2">
        <Heart size={20} /> Mes favoris
        <span className="text-base font-normal text-gray-400">({products.length})</span>
      </h1>

      {products.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <Heart size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium mb-2">Aucun favori</p>
          <p className="text-sm mb-6">Ajoutez des produits à vos favoris pour les retrouver ici.</p>
          <Link href="/boutique" className="btn-primary inline-flex text-sm px-6 py-2.5">
            Parcourir la boutique
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      )}
    </div>
  );
}
