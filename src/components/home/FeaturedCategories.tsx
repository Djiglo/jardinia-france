// ================================================
// JARDINIA FRANCE - Catégories Populaires
// ================================================
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Piscines",
    href: "/boutique/piscines",
    image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=500&q=80",
    count: "12 produits",
    emoji: "🏊",
  },
  {
    name: "Mobilier de jardin",
    href: "/boutique/mobilier-jardin",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    count: "28 produits",
    emoji: "🪑",
  },
  {
    name: "Barbecues",
    href: "/boutique/barbecues",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80",
    count: "15 produits",
    emoji: "🔥",
  },
  {
    name: "Tondeuses & Gazon",
    href: "/boutique/tondeuses-gazon",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80",
    count: "18 produits",
    emoji: "🌿",
  },
  {
    name: "Outils de jardin",
    href: "/boutique/outils-jardin",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80",
    count: "22 produits",
    emoji: "🔧",
  },
  {
    name: "Décoration & Éclairage",
    href: "/boutique/decoration-exterieure",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&q=80",
    count: "20 produits",
    emoji: "✨",
  },
];

export function FeaturedCategories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        {/* Titre */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">Nos catégories</h2>
            <p className="section-subtitle mt-1">
              Tout ce qu'il faut pour aménager et profiter de votre extérieur
            </p>
          </div>
          <Link
            href="/boutique"
            className="hidden md:flex items-center gap-2 text-primary-600 font-medium hover:text-primary-800 transition-colors"
          >
            Toute la boutique <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grille catégories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-card group-hover:shadow-card-hover transition-all duration-300 mb-3">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute top-3 left-3 text-2xl">{cat.emoji}</span>
              </div>
              <h3 className="font-medium text-anthracite-800 text-sm text-center group-hover:text-primary-700 transition-colors">
                {cat.name}
              </h3>
              <span className="text-xs text-gray-400 mt-0.5">{cat.count}</span>
            </Link>
          ))}
        </div>

        {/* Bouton mobile */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/boutique" className="btn-outline">
            Voir toutes les catégories
          </Link>
        </div>
      </div>
    </section>
  );
}
