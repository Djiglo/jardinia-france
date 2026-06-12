"use client";
// ================================================
// JARDINIA FRANCE - Carte Produit
// ================================================
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Eye, Star } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { useWishlist } from "@/hooks/useWishlist";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const primaryImage =
    product.images.find((i) => i.isPrimary) ?? product.images[0];
  const discountPercent = product.compareAtPrice
    ? getDiscountPercent(product.price, product.compareAtPrice)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addItem(product, null, 1);
    toast.success(`${product.name} ajouté au panier !`, {
      icon: "🛒",
    });
  };

  return (
   <div className={cn("product-card group", className)}>
      <Link href={`/boutique/produit/${product.slug}`}>
        {/* Image */}
        <div className="product-card__image">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt ?? product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-5xl">🌿</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discountPercent > 0 && (
              <span className="badge-promo text-xs">-{discountPercent}%</span>
            )}
            {product.isNew && (
              <span className="badge-new text-xs">Nouveau</span>
            )}
            {product.isBestSeller && !product.isNew && (
              <span className="badge-bestseller text-xs">Best-seller</span>
            )}
            {product.stock === 0 && (
              <span className="badge bg-gray-100 text-gray-600 text-xs">
                Rupture
              </span>
            )}
          </div>

          {/* Actions hover */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className={cn("w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center transition-colors", inWishlist ? "text-red-500" : "hover:text-red-500")}
              onClick={(e) => { e.preventDefault(); toggle(product.id, product.name); }}
              aria-label={inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
            </button>
            <button
              className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:text-primary-600 transition-colors"
              onClick={(e) => { e.preventDefault(); window.location.href = `/boutique/produit/${product.slug}`; }}
              aria-label="Voir le produit"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        {/* Infos */}
        <div className="p-4">
          {/* Marque */}
          {product.brand && (
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
              {product.brand.name}
            </p>
          )}

          {/* Nom */}
          <h3 className="text-sm font-medium text-anthracite-800 line-clamp-2 mb-2 group-hover:text-primary-700 transition-colors">
            {product.name}
          </h3>

          {/* Note */}
          {product.averageRating !== undefined && product.reviewCount !== undefined && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    className={
                      star <= Math.round(product.averageRating ?? 0)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300 fill-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">({product.reviewCount})</span>
            </div>
          )}

          {/* Prix */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg text-anthracite-900">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Stock faible */}
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-xs text-orange-500 font-medium mt-1">
              Plus que {product.stock} en stock !
            </p>
          )}
        </div>
      </Link>

      {/* Bouton ajout panier */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
            product.stock === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white"
          )}
        >
          <ShoppingCart size={16} />
          {product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
}
