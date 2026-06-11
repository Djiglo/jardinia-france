"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: any;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [wished, setWished] = useState(false);
  const [adding, setAdding] = useState(false);

  const image = product.images?.[0]?.url ?? null;
  const discount = product.compareAtPrice
    ? getDiscountPercent(product.price, product.compareAtPrice)
    : 0;
  const inStock = product.stock > 0;
  const avgRating = product.averageRating ?? null;
  const reviewCount = product.reviewCount ?? product._count?.reviews ?? 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock) return;
    setAdding(true);
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: image ?? "",
      slug: product.slug,
      stock: product.stock,
    }, 1);
    toast.success("Ajouté au panier !");
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div className={`group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col ${className}`}>
      <Link href={`/boutique/produit/${product.slug}`} className="block relative">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🌿</div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                -{discount}%
              </span>
            )}
            {product.isNew && !discount && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                Nouveau
              </span>
            )}
            {!inStock && (
              <span className="bg-gray-400 text-white text-xs font-bold px-2 py-0.5 rounded">
                Rupture
              </span>
            )}
          </div>

          {/* Favori */}
          <button
            onClick={(e) => { e.preventDefault(); setWished(!wished); }}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart size={15} className={wished ? "fill-red-500 text-red-500" : "text-gray-400"} />
          </button>
        </div>

        {/* Infos */}
        <div className="p-3">
          {product.brand && (
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{product.brand.name}</p>
          )}
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-1.5">
            {product.name}
          </h3>

          {/* Notes */}
          {avgRating && reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-1.5">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={11} className={s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"} />
                ))}
              </div>
              <span className="text-xs text-gray-400">({reviewCount})</span>
            </div>
          )}

          {/* Prix */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>

          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-xs text-orange-500 mt-1">Plus que {product.stock} en stock</p>
          )}
        </div>
      </Link>

      {/* Bouton panier */}
      <div className="px-3 pb-3 mt-auto">
        <button
          onClick={handleAdd}
          disabled={!inStock || adding}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
            !inStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : adding
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-green-600 hover:text-white"
          }`}
        >
          <ShoppingCart size={15} />
          {!inStock ? "Rupture de stock" : adding ? "Ajouté !" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
}
