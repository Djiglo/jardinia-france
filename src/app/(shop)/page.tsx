import Link from "next/link";
import { ArrowRight, Truck, Shield, RotateCcw, Star } from "lucide-react";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { HeroBanner } from "@/components/home/HeroBanner";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";

async function getBestSellers() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isBestSeller: true },
    take: 8,
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: true,
      brand: true,
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return products.map((p) => ({
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    costPrice: p.costPrice ? Number(p.costPrice) : null,
    taxRate: p.taxRate ? Number(p.taxRate) : 0,
    averageRating: null,
    reviewCount: p._count.reviews,
  }));
}

async function getNewProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isNew: true },
    take: 4,
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: true,
      brand: true,
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return products.map((p) => ({
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    costPrice: p.costPrice ? Number(p.costPrice) : null,
    taxRate: p.taxRate ? Number(p.taxRate) : 0,
    averageRating: null,
    reviewCount: p._count.reviews,
  }));
}

const AVANTAGES = [
  { icon: Truck, title: "Livraison gratuite", desc: "Dès 79€ d'achat, livrée partout en France" },
  { icon: Shield, title: "Paiement sécurisé", desc: "Transactions cryptées SSL — Visa, Mastercard, PayPal" },
  { icon: RotateCcw, title: "Retour 30 jours", desc: "Satisfait ou remboursé, retours simples et gratuits" },
  { icon: Star, title: "Service client", desc: "Une équipe disponible 6j/7 pour vous accompagner" },
];

export default async function HomePage() {
  const [bestSellers, newProducts] = await Promise.all([getBestSellers(), getNewProducts()]);

  return (
    <div className="bg-white">

      {/* Slider hero */}
      <HeroBanner />

      {/* Avantages */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {AVANTAGES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
                  <Icon size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catégories */}
      <FeaturedCategories />

      {/* Meilleures ventes */}
      {bestSellers.length > 0 && (
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Meilleures ventes</h2>
                <p className="text-gray-500 text-sm mt-1">Les produits préférés de nos clients</p>
              </div>
              <Link href="/boutique" className="text-green-600 text-sm font-medium hover:underline flex items-center gap-1">
                Tout voir <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Bannière promo */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-2xl px-8 py-10 lg:py-12 max-w-lg">
            <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">Offre limitée</span>
            <h2 className="text-white text-2xl lg:text-3xl font-bold mt-2 mb-3">
              Code promo : JARDINIA10
            </h2>
            <p className="text-gray-400 mb-6">-10% sur votre première commande dès 50€ d'achat</p>
            <Link href="/boutique" className="btn-primary">
              En profiter <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Nouveautés */}
      {newProducts.length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Nouveautés</h2>
                <p className="text-gray-500 text-sm mt-1">Les derniers produits ajoutés</p>
              </div>
              <Link href="/boutique" className="text-green-600 text-sm font-medium hover:underline flex items-center gap-1">
                Tout voir <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {newProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-14 border-t border-gray-100">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Restez informé</h2>
          <p className="text-gray-500 text-sm mb-6">Recevez nos offres exclusives et conseils jardin.</p>
          <NewsletterForm />
          <p className="text-xs text-gray-400 mt-3">Code <strong>BIENVENUE20</strong> offert à l'inscription</p>
        </div>
      </section>
    </div>
  );
}