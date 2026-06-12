// ================================================
// JARDINIA FRANCE - Catégories Populaires
// ================================================
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

const FEATURED_SLUGS = ["piscines", "pergolas", "mobilier-jardin", "barbecues", "tondeuses-gazon", "outils-jardin"];

const CATEGORY_IMAGES: Record<string, string> = {
  "piscines":        "https://i.ibb.co/WNjdyk4K/8057-011726583-3.jpg",
  "mobilier-jardin": "https://i.ibb.co/XxZYhGYb/00-W074391-A.avif",
  "barbecues":       "https://i.ibb.co/RTVRXxpz/1501175-B-rgb-EMEA-1800x1800-06cf445.avif",
  "tondeuses-gazon": "https://i.ibb.co/1tFwdBWC/tondeuse-thermique-lc-353v-husqvarna-2.png",
  "outils-jardin":   "https://i.ibb.co/Q7C7Xj9m/d0.jpg",
  "pergolas":        "https://i.ibb.co/W4zK5tbL/KIT-000573-main-image-web-810faa601fa3497eb7396d1b49b47e00-xlarge.jpg",
};

export async function FeaturedCategories() {
  const rawCategories = await prisma.category.findMany({
    where: { isActive: true, slug: { in: FEATURED_SLUGS } },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });

  // Respecte l'ordre défini dans FEATURED_SLUGS
  const categories = FEATURED_SLUGS
    .map((slug) => rawCategories.find((c) => c.slug === slug))
    .filter(Boolean) as typeof rawCategories;

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
          {categories.map((cat) => {
            const image = CATEGORY_IMAGES[cat.slug] ?? "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80";
            const count = cat._count.products;
            return (
              <Link
                key={cat.slug}
                href={`/boutique/${cat.slug}`}
                className="group flex flex-col items-center"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-card group-hover:shadow-card-hover transition-all duration-300 mb-3">
                  <Image
                    src={image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <h3 className="font-medium text-anthracite-800 text-sm text-center group-hover:text-primary-700 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs text-gray-400 mt-0.5">
                  {count} produit{count !== 1 ? "s" : ""}
                </span>
              </Link>
            );
          })}
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
