// ================================================
// JARDINIA FRANCE - Composants Home (suite)
// ================================================

// ---- BestSellers ----
import Link from "next/link";
import { ArrowRight, Star, Truck, ShieldCheck, RotateCcw, HeadphonesIcon, Tag, Zap, Gift } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { prisma } from "@/lib/prisma";
import { NewsletterForm } from "./NewsletterForm";

// ========================
// Best Sellers
// ========================
export async function BestSellers() {
  const products = await prisma.product.findMany({
    where: { isBestSeller: true, isActive: true },
    take: 4,
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      brand: true,
      reviews: { where: { status: "APPROVED" }, select: { rating: true } },
    },
  });

  const enriched = products.map((p) => ({
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    taxRate: Number(p.taxRate),
    averageRating: p.reviews.length
      ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length
      : undefined,
    reviewCount: p.reviews.length,
    reviews: [],
    variants: [],
    attributes: [],
  }));

  if (!products.length) return null;

  return (
    <section className="py-16 bg-amber-50">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-bestseller">🏆 Best-sellers</span>
            </div>
            <h2 className="section-title">Les plus populaires</h2>
            <p className="section-subtitle mt-1">
              Les produits que nos clients adorent
            </p>
          </div>
          <Link
            href="/boutique?bestseller=true"
            className="hidden md:flex items-center gap-2 text-primary-600 font-medium"
          >
            Voir tout <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {enriched.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================
// Nouveautés
// ========================
export async function NewProducts() {
  const products = await prisma.product.findMany({
    where: { isNew: true, isActive: true },
    take: 4,
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      brand: true,
      reviews: { where: { status: "APPROVED" }, select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const enriched = products.map((p) => ({
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    taxRate: Number(p.taxRate),
    averageRating: p.reviews.length
      ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length
      : undefined,
    reviewCount: p.reviews.length,
    reviews: [],
    variants: [],
    attributes: [],
  }));

  if (!products.length) return null;

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-new">✨ Nouveautés</span>
            </div>
            <h2 className="section-title">Dernières arrivées</h2>
            <p className="section-subtitle mt-1">
              Découvrez nos nouveaux produits de la saison
            </p>
          </div>
          <Link
            href="/boutique?new=true"
            className="hidden md:flex items-center gap-2 text-primary-600 font-medium"
          >
            Voir tout <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {enriched.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================
// Bannière Promo
// ========================
export function PromoBanner() {
  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎁</div>
            <div>
              <p className="font-heading font-bold text-xl">Code promo : JARDINIA10</p>
              <p className="text-primary-200 text-sm">
                -10% sur votre première commande dès 50€ d'achat
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-primary-200" />
              <span>Livraison gratuite dès 79€</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary-200" />
              <span>Paiement sécurisé</span>
            </div>
          </div>
          <Link href="/boutique" className="btn-secondary shrink-0">
            Profiter de l'offre
          </Link>
        </div>
      </div>
    </section>
  );
}

// ========================
// Avantages
// ========================
const advantages = [
  {
    icon: Truck,
    title: "Livraison gratuite",
    description:
      "Livraison offerte dès 79€ d'achat dans toute l'Europe. Livraison express disponible.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: ShieldCheck,
    title: "Paiement 100% sécurisé",
    description:
      "Transactions cryptées SSL. Paiement par carte, PayPal, Apple Pay ou Google Pay.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: RotateCcw,
    title: "Retours sous 30 jours",
    description:
      "Pas satisfait ? Retournez votre article dans les 30 jours, sans question.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: HeadphonesIcon,
    title: "Service client réactif",
    description:
      "Notre équipe répond sous 24h par email ou via notre chat en ligne.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Tag,
    title: "Meilleurs prix garantis",
    description:
      "Nous nous alignons sur tout prix moins cher trouvé chez un concurrent.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: Gift,
    title: "Programme fidélité",
    description:
      "Gagnez des points à chaque achat et profitez de réductions exclusives.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

export function Advantages() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Pourquoi choisir Jardinia France ?</h2>
          <p className="section-subtitle mx-auto mt-2">
            Depuis 2024, nous mettons tout en œuvre pour vous offrir la meilleure
            expérience d'achat pour votre jardin et votre extérieur.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((adv) => (
            <div
              key={adv.title}
              className="bg-white rounded-2xl p-6 shadow-card border border-gray-100"
            >
              <div
                className={`w-12 h-12 ${adv.bg} rounded-xl flex items-center justify-center mb-4`}
              >
                <adv.icon size={24} className={adv.color} />
              </div>
              <h3 className="font-semibold text-anthracite-900 mb-2">{adv.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{adv.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================
// Témoignages
// ========================
const testimonials = [
  {
    name: "Sophie M.",
    location: "Paris 16ème",
    rating: 5,
    text: "Commande reçue en 4 jours, piscine montée en 2h. La qualité est au rendez-vous. Je recommande vivement Jardinia France !",
    product: "Piscine Intex Ultra XTR",
    date: "Juin 2026",
    avatar: "S",
  },
  {
    name: "Thomas R.",
    location: "Lyon",
    rating: 5,
    text: "Le barbecue Weber est superbe. Service client impeccable quand j'avais une question sur l'assemblage. Parfait !",
    product: "Weber Spirit E-315",
    date: "Mai 2026",
    avatar: "T",
  },
  {
    name: "Marie-Claire D.",
    location: "Marseille",
    rating: 5,
    text: "Le salon de jardin est encore plus beau qu'en photos. La qualité de la résine tressée est vraiment premium. Ma terrasse est transformée !",
    product: "Salon résine tressée 6 places",
    date: "Avril 2026",
    avatar: "M",
  },
  {
    name: "Pierre L.",
    location: "Bordeaux",
    rating: 4,
    text: "Tondeuse robot livrée rapidement, fonctionne parfaitement. Je n'aurais jamais pensé gagner autant de temps. Top !",
    product: "Bosch Indego S+ 500",
    date: "Mai 2026",
    avatar: "P",
  },
];

export function Testimonials() {
  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Ce que disent nos clients</h2>
          <p className="section-subtitle mx-auto mt-2">
            Plus de 500 avis vérifiés sur nos produits
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={20} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="font-bold text-lg">4.8</span>
            <span className="text-gray-500">/ 5 — 512 avis</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6">
              {/* En-tête */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-bold">{t.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.location}</p>
                </div>
              </div>

              {/* Étoiles */}
              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={
                      s <= t.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              {/* Texte */}
              <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Produit */}
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-400">
                  ✅ Achat vérifié · {t.product}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{t.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================
// Newsletter
// ========================
export function Newsletter() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary-700 to-nature-700 text-white">
      <div className="container-custom text-center">
        <div className="max-w-xl mx-auto">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">
            Restez dans la boucle
          </h2>
          <p className="text-primary-200 mb-8">
            Inscrivez-vous à notre newsletter et recevez en exclusivité nos meilleures
            offres, conseils jardinage et nouveautés. Cadeau : <strong>10% de réduction</strong> sur
            votre première commande.
          </p>

          <NewsletterForm />
          <p className="text-xs text-primary-300 mt-3">
            Pas de spam, désinscription en 1 clic. Conforme RGPD.
          </p>
        </div>
      </div>
    </section>
  );
}

// ========================
// FAQ Rapide
// ========================
const faqs = [
  {
    q: "Quels sont les délais de livraison ?",
    a: "Livraison standard en 5-7 jours ouvrés. Livraison express en 2-3 jours ouvrés disponible à la commande. Livraison dans toute l'Europe.",
  },
  {
    q: "La livraison est-elle gratuite ?",
    a: "Oui ! La livraison standard est offerte dès 79€ d'achat. En dessous, les frais de port sont de 5,99€.",
  },
  {
    q: "Puis-je retourner un produit ?",
    a: "Absolument. Vous disposez de 30 jours après réception pour retourner tout article dans son emballage d'origine.",
  },
  {
    q: "Vos paiements sont-ils sécurisés ?",
    a: "Oui, 100%. Nous utilisons Stripe, le leader mondial du paiement sécurisé. Vos données bancaires sont cryptées et jamais stockées.",
  },
  {
    q: "Comment suivre ma commande ?",
    a: "Dès l'expédition, vous recevrez un email avec votre numéro de suivi. Vous pouvez aussi suivre votre colis depuis votre espace client.",
  },
  {
    q: "Livrez-vous dans toute l'Europe ?",
    a: "Oui ! Nous livrons dans tous les pays de l'Union Européenne et en Suisse. Les délais et frais peuvent varier selon le pays.",
  },
];

export function QuickFAQ() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="section-title">Questions fréquentes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
              <h3 className="font-semibold text-anthracite-800 mb-2 flex items-start gap-2">
                <span className="text-primary-600 mt-0.5">?</span>
                {faq.q}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed pl-5">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/faq" className="btn-outline">
            Voir toutes les FAQ
          </Link>
        </div>
      </div>
    </section>
  );
}
