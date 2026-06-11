"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, ChevronRight, Plus, Minus, Share2, Check } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import ProductCard from "@/components/shop/ProductCard";
import toast from "react-hot-toast";

interface ProductPageClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [wishlist, setWishlist] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);

  const price = selectedVariant?.price ?? product.price;
  const compareAt = selectedVariant?.compareAtPrice ?? product.compareAtPrice;
  const discount = getDiscountPercent(price, compareAt);
  const inStock = (selectedVariant?.stock ?? product.stock) > 0;

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
    setJustAdded(true);
    toast.success("Produit ajouté au panier !");
    setTimeout(() => setJustAdded(false), 2000);
  };

  const tabs = [
    { key: "description", label: "Description" },
    { key: "specs", label: "Caractéristiques" },
    { key: "reviews", label: `Avis (${product.reviewCount})` },
  ] as const;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Fil d'ariane */}
      <nav className="breadcrumb mb-6 text-sm text-gray-500 flex items-center gap-1">
        <Link href="/" className="hover:text-primary-600">Accueil</Link>
        <ChevronRight size={14} />
        <Link href="/boutique" className="hover:text-primary-600">Boutique</Link>
        <ChevronRight size={14} />
        <Link href={`/boutique?category=${product.category.slug}`} className="hover:text-primary-600">
          {product.category.name}
        </Link>
        <ChevronRight size={14} />
        <span className="text-anthracite-700">{product.name}</span>
      </nav>

      {/* Bloc principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Galerie */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <Image
              src={product.images[selectedImage]?.url ?? "/placeholder.svg"}
              alt={product.images[selectedImage]?.alt ?? product.name}
              fill
              className="object-contain p-4"
              priority
            />
            {discount && (
              <span className="absolute top-3 left-3 badge badge-sale">-{discount}%</span>
            )}
            {product.isNew && !discount && (
              <span className="absolute top-3 left-3 badge badge-new">Nouveau</span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img: any, i: number) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-primary-500" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image src={img.url} alt={img.alt ?? ""} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Infos produit */}
        <div className="flex flex-col gap-4">
          {/* Marque & titre */}
          {product.brand && (
            <span className="text-sm font-medium text-primary-600 uppercase tracking-wide">
              {product.brand.name}
            </span>
          )}
          <h1 className="text-2xl lg:text-3xl font-bold text-anthracite-900">{product.name}</h1>

          {/* Note */}
          {product.avgRating && (
            <div className="flex items-center gap-2">
              <div className="stars flex">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={16} className={s <= Math.round(product.avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.avgRating.toFixed(1)} · {product.reviewCount} avis
              </span>
            </div>
          )}

          {/* Référence */}
          <p className="text-xs text-gray-400">Réf. : {product.sku}</p>

          {/* Prix */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary-600">{formatPrice(price)}</span>
            {compareAt && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(compareAt)}</span>
            )}
            {discount && (
              <span className="text-sm font-semibold text-red-500">Économisez {formatPrice(compareAt! - price)}</span>
            )}
          </div>

          {/* Description courte */}
          {product.shortDescription && (
            <p className="text-gray-600 leading-relaxed">{product.shortDescription}</p>
          )}

          {/* Variantes */}
          {product.variants.length > 0 && (
            <div>
              <p className="text-sm font-medium text-anthracite-700 mb-2">Variante :</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id === selectedVariant?.id ? null : v)}
                    disabled={v.stock === 0}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                      v.stock === 0
                        ? "opacity-40 cursor-not-allowed border-gray-200 text-gray-400"
                        : selectedVariant?.id === v.id
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-300 hover:border-primary-400 text-gray-700"
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantité & panier */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-50 transition-colors"
                aria-label="Diminuer"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQty(Math.min(selectedVariant?.stock ?? product.stock, quantity + 1))}
                className="px-3 py-2 hover:bg-gray-50 transition-colors"
                aria-label="Augmenter"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`btn-primary flex-1 flex items-center justify-center gap-2 py-3 ${
                !inStock ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {justAdded ? (
                <><Check size={18} /> Ajouté !</>
              ) : (
                <><ShoppingCart size={18} /> {inStock ? "Ajouter au panier" : "Rupture de stock"}</>
              )}
            </button>

            <button
              onClick={() => setWishlist(!wishlist)}
              className={`p-3 rounded-lg border transition-colors ${
                wishlist ? "border-red-300 bg-red-50 text-red-500" : "border-gray-200 hover:border-red-300 text-gray-500"
              }`}
              aria-label="Favoris"
            >
              <Heart size={18} fill={wishlist ? "currentColor" : "none"} />
            </button>

            <button
              onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
              className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 text-gray-500 transition-colors"
              aria-label="Partager"
            >
              <Share2 size={18} />
            </button>
          </div>

          {/* Stock */}
          <p className={`text-sm font-medium ${inStock ? "text-green-600" : "text-red-500"}`}>
            {inStock ? `✓ En stock (${selectedVariant?.stock ?? product.stock} disponibles)` : "✗ Rupture de stock"}
          </p>

          {/* Garanties */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
            <div className="flex flex-col items-center text-center gap-1">
              <Truck size={20} className="text-primary-600" />
              <span className="text-xs text-gray-500">Livraison gratuite dès 79€</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Shield size={20} className="text-primary-600" />
              <span className="text-xs text-gray-500">Paiement sécurisé</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <RotateCcw size={20} className="text-primary-600" />
              <span className="text-xs text-gray-500">Retour sous 30 jours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs description / specs / avis */}
      <div className="mb-16">
        <div className="flex border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.key
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <div
            className="prose prose-green max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, "<br/>") }}
          />
        )}

        {activeTab === "specs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
            {product.attributes.map((attr: any) => (
              <div key={attr.id} className="flex justify-between py-2.5 px-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-anthracite-700 text-sm">{attr.name}</span>
                <span className="text-gray-600 text-sm">{attr.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4 max-w-3xl">
            {product.reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun avis pour le moment. Soyez le premier !</p>
            ) : (
              product.reviews.map((review: any) => (
                <div key={review.id} className="card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-anthracite-800">{review.user?.name ?? "Client vérifié"}</p>
                      <div className="flex mt-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={14} className={s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                  {review.isVerified && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-2">
                      <Check size={12} /> Achat vérifié
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Produits similaires */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-anthracite-800 mb-6">Produits similaires</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p: any) => (
              <ProductCard
                key={p.id}
                product={{
                  ...p,
                  averageRating: null,
                  reviewCount: p._count.reviews,
                  compareAtPrice: p.compareAtPrice,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
