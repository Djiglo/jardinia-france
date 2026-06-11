import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Piscines",
    href: "/boutique/piscines",
    image: "https://i.ibb.co/rhRdskY/piscine-tubulaire-ronde.jpg",
    emoji: "🏊",
  },
  {
    name: "Mobilier de jardin",
    href: "/boutique/mobilier-jardin",
    image: "https://i.ibb.co/5hdsCV8M/7017859c-f59c-444b-8f21-16fd1d7ff327.png",
    emoji: "🪑",
  },
  {
    name: "Barbecues",
    href: "/boutique/barbecues",
    image: "https://i.ibb.co/RTVRXxpz/1501175-B-rgb-EMEA-1800x1800-06cf445.avif",
    emoji: "🔥",
  },
  {
    name: "Tondeuses & Gazon",
    href: "/boutique/tondeuses-gazon",
    image: "https://i.ibb.co/1YmnxnHB/images.avif",
    emoji: "🌿",
  },
  {
    name: "Outils De Jardin",
    href: "/boutique/outils-jardin",
    image: "https://i.ibb.co/Q7C7Xj9m/d0.jpg",
    emoji: "🔧",
  },
  {
    name: "Pergola",
    href: "/boutique/decoration-exterieure",
    image: "https://i.ibb.co/KcPqZCfN/00-W078012-A-1.webp",
    emoji: "✨",
  },
];

export function FeaturedCategories() {
  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nos catégories</h2>
            <p className="text-gray-500 text-sm mt-1">Tout pour aménager votre extérieur</p>
          </div>
          <Link href="/boutique" className="text-green-600 text-sm font-medium hover:underline flex items-center gap-1">
            Toute la boutique <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2 border border-gray-200 group-hover:border-green-300 group-hover:shadow-md transition-all duration-200">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 33vw, 17vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-green-600 transition-colors leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
