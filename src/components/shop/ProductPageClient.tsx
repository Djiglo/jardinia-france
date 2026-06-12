"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, Heart, Star, Truck, Shield, RotateCcw,
  ChevronRight, Plus, Minus, Share2, Check, BadgeCheck,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import ProductCard from "@/components/shop/ProductCard";
import toast from "react-hot-toast";
import { useWishlist } from "@/hooks/useWishlist";

interface ProductPageClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "reviews">("specs");
  const [justAdded, setJustAdded] = useState(false);

  const { toggle: toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const { data: session } = useSession();
  const addItem = useCartStore((s) => s.addItem);

  // Review form
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const submitReview = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return;
    setReviewLoading(true);
    setReviewError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, ...reviewForm }),
      });
      const data = await res.json();
      if (!res.ok) { setReviewError(data.error ?? "Erreur"); return; }
      setReviewDone(true);
      toast.success("Merci ! Votre avis sera publié après modération.");
    } catch {
      setReviewError("Une erreur est survenue.");
    } finally {
      setReviewLoading(false);
    }
  }, [product.id, reviewForm]);

  const price = selectedVariant?.price ?? product.price;
  const compareAt = selectedVariant?.compareAtPrice ?? product.compareAtPrice;
  const discount = getDiscountPercent(price, compareAt);
  const inStock = (selectedVariant?.stock ?? product.stock) > 0;
  const stockQty = selectedVariant?.stock ?? product.stock;

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
    setJustAdded(true);
    toast.success("Produit ajouté au panier !");
    setTimeout(() => setJustAdded(false), 2000);
  };

  const tabs = [
    { key: "specs", label: "Caractéristiques" },
    { key: "reviews", label: `Avis (${product.reviewCount ?? product.reviews?.length ?? 0})` },
  ] as const;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
        <Link href="/" className="hover:text-primary-600 transition-colors">Accueil</Link>
        <ChevronRight size={12} />
        <Link href="/boutique" className="hover:text-primary-600 transition-colors">Boutique</Link>
        <ChevronRight size={12} />
        <Link href={`/boutique/${product.category.slug}`} className="hover:text-primary-600 transition-colors">
          {product.category.name}
        </Link>
        <ChevronRight size={12} />
        <span className="text-anthracite-600 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main grid — image left, ALL info + description right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-10 xl:gap-16 mb-16">

        {/* ── Galerie ── */}
        <div className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <Image
              src={product.images[selectedImage]?.url ?? "/placeholder.svg"}
              alt={product.images[selectedImage]?.alt ?? product.name}
              fill
              className="object-contain p-6 transition-opacity duration-300"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {discount && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                -{discount}%
              </span>
            )}
            {product.isNew && !discount && (
              <span className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Nouveau
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img: any, i: number) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-18 h-18 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? "border-primary-500 shadow-md scale-[1.04]"
                      : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
                  }`}
                  style={{ width: 72, height: 72 }}
                >
                  <Image src={img.url} alt={img.alt ?? ""} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Colonne droite complète ── */}
        <div className="flex flex-col gap-6">

          {/* En-tête produit */}
          <div>
            {product.brand && (
              <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">
                {product.brand.name}
              </span>
            )}
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-anthracite-950 leading-tight mb-3">
              {product.name}
            </h1>

            {/* Note + ref */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {(product.avgRating || product.averageRating) && (
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={14} className={
                        s <= Math.round(product.avgRating ?? product.averageRating ?? 0)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200 fill-gray-200"
                      } />
                    ))}
                  </div>
                  <span className="text-gray-500">
                    {(product.avgRating ?? product.averageRating ?? 0).toFixed(1)}
                    <span className="text-gray-400 ml-1">({product.reviewCount} avis)</span>
                  </span>
                </div>
              )}
              <span className="text-gray-300">·</span>
              <span className="text-gray-400 text-xs">Réf. {product.sku}</span>
            </div>
          </div>

          {/* Prix */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-gray-100">
            <span className="font-display text-4xl font-bold text-primary-600">{formatPrice(price)}</span>
            {compareAt && (
              <>
                <span className="text-xl text-gray-400 line-through">{formatPrice(compareAt)}</span>
                <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                  Économisez {formatPrice(compareAt - price)}
                </span>
              </>
            )}
          </div>

          {/* Description courte */}
          {product.shortDescription && (
            <p className="text-gray-600 leading-relaxed text-[15px]">{product.shortDescription}</p>
          )}

          {/* Variantes */}
          {product.variants?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-anthracite-700 mb-2">Variante</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id === selectedVariant?.id ? null : v)}
                    disabled={v.stock === 0}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      v.stock === 0
                        ? "opacity-35 cursor-not-allowed border-gray-200 text-gray-400"
                        : selectedVariant?.id === v.id
                        ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm"
                        : "border-gray-200 hover:border-primary-300 text-gray-700"
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantité + panier */}
          <div className="flex items-stretch gap-3">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <button
                onClick={() => setQty(Math.max(1, quantity - 1))}
                className="w-11 flex items-center justify-center hover:bg-gray-100 transition-colors h-full"
                aria-label="Diminuer"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-semibold text-anthracite-900">{quantity}</span>
              <button
                onClick={() => setQty(Math.min(stockQty, quantity + 1))}
                className="w-11 flex items-center justify-center hover:bg-gray-100 transition-colors h-full"
                aria-label="Augmenter"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                !inStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : justAdded
                  ? "bg-green-600 text-white"
                  : "bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md active:scale-[0.98]"
              }`}
            >
              {justAdded ? (
                <><Check size={18} /> Ajouté !</>
              ) : (
                <><ShoppingCart size={18} /> {inStock ? "Ajouter au panier" : "Rupture de stock"}</>
              )}
            </button>

            <button
              onClick={() => toggleWishlist(product.id, product.name)}
              className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                inWishlist
                  ? "border-red-300 bg-red-50 text-red-500"
                  : "border-gray-200 hover:border-red-300 hover:text-red-400 text-gray-400"
              }`}
              aria-label={inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
            </button>

            <button
              onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
              className="w-12 h-12 rounded-xl border border-gray-200 hover:border-gray-300 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-all"
              aria-label="Partager"
            >
              <Share2 size={18} />
            </button>
          </div>

          {/* Stock */}
          <p className={`text-sm font-medium flex items-center gap-1.5 ${inStock ? "text-green-600" : "text-red-500"}`}>
            {inStock ? (
              <><BadgeCheck size={16} /> En stock — {stockQty} disponible{stockQty > 1 ? "s" : ""}</>
            ) : (
              "✗ Rupture de stock"
            )}
          </p>

          {/* ── Description complète ── (anciennement dans le tab) */}
          {product.description && (
            <div className="border-t border-gray-100 pt-6">
              <h2 className="font-display text-lg font-semibold text-anthracite-900 mb-3">Description</h2>
              <div
                className="text-gray-600 text-[15px] leading-relaxed space-y-3 prose prose-sm prose-p:text-gray-600 prose-headings:text-anthracite-800 max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, "<br/>") }}
              />
            </div>
          )}

          {/* Garanties */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
            {[
              { icon: Truck, title: "Livraison gratuite", sub: "dès 79 € d'achat" },
              { icon: Shield, title: "Paiement sécurisé", sub: "CB, Stripe, 3D Secure" },
              { icon: RotateCcw, title: "Retour 30 jours", sub: "Remboursement garanti" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex flex-col items-center text-center gap-1 p-3 rounded-xl bg-gray-50">
                <Icon size={20} className="text-primary-600 mb-0.5" />
                <span className="text-xs font-semibold text-anthracite-700">{title}</span>
                <span className="text-[11px] text-gray-400">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs : Caractéristiques + Avis (sous la grille) ── */}
      <div className="mb-16">
        <div className="flex border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                activeTab === tab.key
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "specs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-w-2xl">
            {product.attributes?.length > 0 ? (
              product.attributes.map((attr: any) => (
                <div key={attr.id} className="flex justify-between py-2.5 px-4 bg-gray-50 rounded-xl text-sm">
                  <span className="font-medium text-anthracite-700">{attr.name}</span>
                  <span className="text-gray-500">{attr.value}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm py-4">Aucune caractéristique renseignée.</p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4 max-w-3xl">
            {product.reviews?.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Aucun avis pour le moment. Soyez le premier !</p>
            ) : (
              product.reviews?.map((review: any) => (
                <div key={review.id} className="p-5 border border-gray-100 rounded-2xl">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-anthracite-800 text-sm">{review.user?.name ?? "Client vérifié"}</p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={13} className={s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                  {review.title && <p className="font-semibold text-sm mb-1 text-anthracite-700">{review.title}</p>}
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                  {review.isVerified && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-2 font-medium">
                      <Check size={12} /> Achat vérifié
                    </span>
                  )}
                </div>
              ))
            )}

            {/* Formulaire avis */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="font-display text-base font-semibold text-anthracite-900 mb-4">Laisser un avis</h3>
              {!session?.user ? (
                <p className="text-sm text-gray-500">
                  <Link href="/auth/connexion" className="text-primary-600 hover:underline font-medium">Connectez-vous</Link>{" "}
                  pour laisser un avis.
                </p>
              ) : reviewDone ? (
                <div className="flex items-center gap-2 p-4 bg-green-50 rounded-xl text-green-700 text-sm font-medium">
                  <Check size={16} /> Votre avis est en attente de modération. Merci !
                </div>
              ) : (
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-anthracite-700 mb-2">Note *</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((s) => (
                        <button key={s} type="button" onClick={() => setReviewForm((f) => ({ ...f, rating: s }))} className="transition-transform hover:scale-110">
                          <Star size={26} className={s <= reviewForm.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-anthracite-700 block mb-1">Titre <span className="text-gray-400 font-normal">(optionnel)</span></label>
                    <input type="text" value={reviewForm.title} onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))} placeholder="Ex : Excellent produit !" className="input w-full" maxLength={120} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-anthracite-700 block mb-1">Commentaire *</label>
                    <textarea value={reviewForm.comment} onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))} placeholder="Partagez votre expérience…" rows={4} required className="input w-full resize-none" maxLength={2000} />
                  </div>
                  {reviewError && (
                    <p className="text-sm text-red-600">{reviewError === "ALREADY_REVIEWED" ? "Vous avez déjà laissé un avis pour ce produit." : reviewError}</p>
                  )}
                  <button type="submit" disabled={reviewLoading || !reviewForm.comment.trim()} className="btn-primary px-6 py-2.5 disabled:opacity-50">
                    {reviewLoading ? "Envoi…" : "Publier mon avis"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Produits similaires */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold text-anthracite-900 mb-6">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p: any) => (
              <ProductCard
                key={p.id}
                product={{
                  ...p,
                  averageRating: null,
                  reviewCount: p._count?.reviews ?? 0,
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
