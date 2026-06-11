"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ShoppingBag, MapPin, Truck, CreditCard, Check, ArrowLeft, Lock } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

type Step = "address" | "shipping" | "payment";

const STEPS: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: "address", label: "Adresse", icon: MapPin },
  { key: "shipping", label: "Livraison", icon: Truck },
  { key: "payment", label: "Paiement", icon: CreditCard },
];

const EU_COUNTRIES = [
  "France", "Belgique", "Luxembourg", "Suisse", "Allemagne", "Espagne", "Italie",
  "Portugal", "Pays-Bas", "Autriche", "Pologne", "Roumanie", "Grèce", "Tchéquie",
  "Hongrie", "Suède", "Danemark", "Finlande", "Norvège", "Irlande",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, coupon, clearCart } = useCartStore();

  const [step, setStep] = useState<Step>("address");
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    firstName: "", lastName: "", email: session?.user?.email ?? "",
    phone: "", address: "", city: "", postalCode: "", country: "France",
  });

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  const shippingCost = subtotal >= 79 ? 0 : shippingMethod === "express" ? 12.99 : 5.99;
  const discountAmount = coupon
    ? coupon.type === "percentage" ? (subtotal * coupon.discount) / 100 : coupon.discount
    : 0;
  const total = subtotal - discountAmount + shippingCost;

  useEffect(() => {
    if (items.length === 0) router.push("/panier");
  }, [items, router]);

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const required = ["firstName", "lastName", "email", "address", "city", "postalCode", "country"];
    const missing = required.filter((k) => !address[k as keyof typeof address]);
    if (missing.length) { toast.error("Veuillez remplir tous les champs obligatoires"); return; }
    setStep("shipping");
  };

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, address, shippingMethod, coupon }),
      });
      const { url, error } = await res.json();
      if (error) { toast.error(error); return; }
      window.location.href = url;
    } catch {
      toast.error("Erreur lors du paiement");
    } finally {
      setLoading(false);
    }
  };

  const OrderSummary = () => (
    <div className="card p-5 sticky top-4">
      <h3 className="font-semibold text-anthracite-800 mb-4 flex items-center gap-2">
        <ShoppingBag size={18} />
        Récapitulatif
      </h3>
      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm gap-2">
            <span className="text-gray-600 truncate">
              {item.name}
              <span className="text-gray-400"> ×{item.quantity}</span>
            </span>
            <span className="font-medium whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Sous-total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Réduction</span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Livraison</span>
          <span>{shippingCost === 0 ? <span className="text-green-600">Gratuite</span> : formatPrice(shippingCost)}</span>
        </div>
      </div>
      <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold">
        <span>Total TTC</span>
        <span className="text-primary-600 text-lg">{formatPrice(total)}</span>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-gray-400 justify-center">
        <Lock size={12} />
        Paiement 100% sécurisé
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/panier" className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6">
        <ArrowLeft size={16} />
        Retour au panier
      </Link>

      <h1 className="text-2xl font-bold text-anthracite-800 mb-6">Finaliser ma commande</h1>

      {/* Stepper */}
      <div className="flex items-center justify-center mb-8 gap-0">
        {STEPS.map((s, i) => {
          const done = i < stepIndex;
          const active = s.key === step;
          const Icon = s.icon;
          return (
            <div key={s.key} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                active ? "bg-primary-600 text-white" : done ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
              }`}>
                {done ? <Check size={16} /> : <Icon size={16} />}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 ${done ? "bg-green-300" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Étape 1 : Adresse */}
          {step === "address" && (
            <form onSubmit={handleAddressSubmit} className="card p-6 space-y-4">
              <h2 className="font-semibold text-anthracite-800 text-lg mb-2">Adresse de livraison</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input className="input" value={address.firstName} onChange={(e) => setAddress({...address, firstName: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input className="input" value={address.lastName} onChange={(e) => setAddress({...address, lastName: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                <input type="email" className="input" value={address.email} onChange={(e) => setAddress({...address, email: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input type="tel" className="input" value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                <input className="input" value={address.address} onChange={(e) => setAddress({...address, address: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code postal *</label>
                  <input className="input" value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                  <input className="input" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
                <select className="input" value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})}>
                  {EU_COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                Continuer vers la livraison
                <Truck size={18} />
              </button>
            </form>
          )}

          {/* Étape 2 : Livraison */}
          {step === "shipping" && (
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-anthracite-800 text-lg mb-2">Mode de livraison</h2>
              {[
                { id: "standard", label: "Livraison standard", delay: "3-5 jours ouvrés", price: subtotal >= 79 ? 0 : 5.99 },
                { id: "express", label: "Livraison express", delay: "1-2 jours ouvrés", price: subtotal >= 79 ? 0 : 12.99 },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    shippingMethod === method.id ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={method.id}
                    checked={shippingMethod === method.id}
                    onChange={() => setShippingMethod(method.id as "standard" | "express")}
                    className="accent-primary-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-anthracite-800">{method.label}</p>
                    <p className="text-sm text-gray-500">{method.delay}</p>
                  </div>
                  <span className="font-semibold text-anthracite-700">
                    {method.price === 0 ? <span className="text-green-600">Gratuit</span> : formatPrice(method.price)}
                  </span>
                </label>
              ))}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep("address")} className="btn-outline flex-1 flex items-center justify-center gap-2">
                  <ArrowLeft size={16} /> Retour
                </button>
                <button onClick={() => setStep("payment")} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  Continuer <CreditCard size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Étape 3 : Paiement */}
          {step === "payment" && (
            <div className="card p-6 space-y-5">
              <h2 className="font-semibold text-anthracite-800 text-lg">Paiement sécurisé</h2>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <Lock size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Paiement sécurisé par Stripe</p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    Vos données bancaires sont chiffrées et ne sont jamais stockées sur nos serveurs.
                  </p>
                </div>
              </div>

              {/* Récap adresse */}
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                <p className="font-medium text-anthracite-700 mb-1">Livraison à :</p>
                <p>{address.firstName} {address.lastName}</p>
                <p>{address.address}, {address.postalCode} {address.city}, {address.country}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("shipping")} className="btn-outline flex items-center gap-2">
                  <ArrowLeft size={16} /> Retour
                </button>
                <button
                  onClick={handleStripeCheckout}
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Redirection...</span>
                  ) : (
                    <><Lock size={18} /> Payer {formatPrice(total)}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Récapitulatif */}
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
