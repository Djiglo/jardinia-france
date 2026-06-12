"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, removeItem, updateQuantity, coupon, setCoupon, subtotal, shippingCost, total, clearCart } =
    useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const validateCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setCoupon({ code: data.code, discount: data.discount, type: data.type });
        toast.success(`Code "${data.code}" appliqué !`);
      } else {
        toast.error(data.message ?? "Code invalide");
      }
    } catch {
      toast.error("Erreur lors de la validation");
    } finally {
      setCouponLoading(false);
    }
  };

  const discountAmount =
    coupon
      ? coupon.type === "percentage"
        ? (subtotal * coupon.discount) / 100
        : coupon.type === "free_shipping" ? 0 : coupon.discount
      : 0;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingCart size={64} className="mx-auto text-gray-300 mb-6" />
        <h1 className="text-2xl font-bold text-anthracite-800 mb-3">Votre panier est vide</h1>
        <p className="text-gray-500 mb-8">Découvrez nos produits et commencez vos achats !</p>
        <Link href="/boutique" className="btn-primary inline-flex items-center gap-2">
          <ShoppingBag size={18} />
          Continuer mes achats
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-anthracite-800 mb-8 flex items-center gap-3">
        <ShoppingCart size={24} />
        Mon panier
        <span className="text-base font-normal text-gray-500">({items.length} article{items.length > 1 ? "s" : ""})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste articles */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const itemPrice = Number(item.variant?.price ?? item.product.price);
            const itemImage = item.product.images?.[0]?.url ?? "/placeholder.svg";
            const itemStock = item.variant?.stock ?? item.product.stock;
            return (
            <div key={item.id} className="card p-4 flex gap-4">
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                <Image src={itemImage} alt={item.product.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/boutique/produit/${item.product.slug}`} className="font-medium text-anthracite-800 hover:text-primary-600 line-clamp-2 block">
                  {item.product.name}
                  {item.variant && <span className="text-sm font-normal text-gray-400 ml-1">— {item.variant.value}</span>}
                </Link>
                <p className="text-primary-600 font-bold mt-1">{formatPrice(itemPrice)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-gray-50 transition-colors"
                      aria-label="Diminuer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= itemStock}
                      className="px-2 py-1 hover:bg-gray-50 transition-colors disabled:opacity-40"
                      aria-label="Augmenter"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-anthracite-700">
                    {formatPrice(itemPrice * item.quantity)}
                  </span>
                  <button
                    onClick={() => { removeItem(item.id); toast.success("Article retiré"); }}
                    className="ml-auto text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          )})}

          <div className="flex justify-between items-center pt-2">
            <button onClick={() => { clearCart(); toast.success("Panier vidé"); }} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
              <Trash2 size={14} />
              Vider le panier
            </button>
            <Link href="/boutique" className="btn-outline text-sm">
              Continuer mes achats
            </Link>
          </div>
        </div>

        {/* Récapitulatif */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold text-anthracite-800 text-lg mb-4">Récapitulatif</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Réduction ({coupon?.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>
                  {shippingCost === 0
                    ? <span className="text-green-600 font-medium">Gratuite</span>
                    : formatPrice(shippingCost)}
                </span>
              </div>
              {subtotal < 79 && shippingCost > 0 && (
                <p className="text-xs text-primary-600 bg-primary-50 rounded p-2">
                  Plus que {formatPrice(79 - subtotal)} pour la livraison gratuite !
                </p>
              )}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-lg">
              <span className="text-anthracite-800">Total</span>
              <span className="text-primary-600">{formatPrice(total - discountAmount)}</span>
            </div>

            <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 mt-5 py-3">
              Passer commande
              <ArrowRight size={18} />
            </Link>

            <div className="flex items-center justify-center gap-3 mt-4 opacity-60">
              {["visa", "mastercard", "amex", "paypal"].map((p) => (
                <div key={p} className="w-8 h-5 bg-gray-200 rounded text-xs flex items-center justify-center capitalize">
                  {p.slice(0, 2)}
                </div>
              ))}
            </div>
          </div>

          {/* Code promo */}
          <div className="card p-5">
            <h3 className="font-medium text-anthracite-700 mb-3 flex items-center gap-2">
              <Tag size={16} />
              Code de réduction
            </h3>
            {coupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                <div>
                  <span className="font-medium text-green-700">{coupon.code}</span>
                  <p className="text-xs text-green-600">
                    {coupon.type === "percentage" ? `-${coupon.discount}%` : `-${formatPrice(coupon.discount)}`}
                  </p>
                </div>
                <button onClick={() => setCoupon(null)} className="text-gray-400 hover:text-red-500 text-xs" type="button">
                  Retirer
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="JARDINIA10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && validateCoupon()}
                  className="input flex-1 text-sm py-2"
                />
                <button
                  onClick={validateCoupon}
                  disabled={couponLoading || !couponInput.trim()}
                  className="btn-outline text-sm px-3 py-2 disabled:opacity-50"
                >
                  {couponLoading ? "..." : "OK"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
