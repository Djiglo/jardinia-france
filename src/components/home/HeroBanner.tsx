"use client";
// ================================================
// JARDINIA FRANCE - Hero Banner
// ================================================
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    title: "Préparez votre été 2025",
    subtitle: "Piscines & accessoires",
    description:
      "Profitez de -20% sur toute notre sélection de piscines hors-sol. Des modèles pour toutes les tailles de jardin.",
    image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=1600&q=80",
    href: "/boutique/piscines",
    btnLabel: "Découvrir les piscines",
    badge: "Jusqu'à -20%",
    badgeColor: "bg-red-500",
  },
  {
    id: 2,
    title: "Mobilier de jardin premium",
    subtitle: "Collections 2025 disponibles",
    description:
      "Tables, chaises, salons de jardin... Créez l'espace extérieur de vos rêves avec nos collections sélectionnées.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
    href: "/boutique/mobilier-jardin",
    btnLabel: "Explorer le mobilier",
    badge: "Nouveautés",
    badgeColor: "bg-primary-600",
  },
  {
    id: 3,
    title: "L'été commence ici",
    subtitle: "Barbecues & plancha",
    description:
      "Gaz, charbon ou électrique : trouvez le barbecue idéal pour vos soirées estivales. Weber, Jardinia Pro et plus.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80",
    href: "/boutique/barbecues",
    btnLabel: "Voir les barbecues",
    badge: "Best-sellers",
    badgeColor: "bg-orange-500",
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setIsAutoPlaying(false);
    setCurrent((c) => (c + 1) % slides.length);
  };

  const slide = slides[current];

  return (
    <section className="relative h-[520px] md:h-[620px] overflow-hidden bg-anthracite-900">
      {/* Image de fond */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === current ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Contenu */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container-custom">
          <div className="max-w-2xl">
            <span
              className={cn(
                "inline-block text-white text-sm font-bold px-3 py-1 rounded-full mb-4 transition-all duration-500",
                slide.badgeColor
              )}
            >
              {slide.badge}
            </span>
            <p className="text-primary-300 font-medium text-lg mb-2 transition-all duration-500">
              {slide.subtitle}
            </p>
            <h1 className="text-white font-heading font-bold text-4xl md:text-6xl leading-tight mb-4 text-balance">
              {slide.title}
            </h1>
            <p className="text-gray-200 text-lg mb-8 leading-relaxed max-w-xl">
              {slide.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={slide.href} className="btn-primary btn-lg group">
                {slide.btnLabel}
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link href="/boutique" className="btn-secondary btn-lg bg-white/10 border-white/30 text-white hover:bg-white/20">
                Toute la boutique
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm transition-all"
        aria-label="Slide précédent"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm transition-all"
        aria-label="Slide suivant"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicateurs */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrent(i);
            }}
            className={cn(
              "transition-all duration-300 rounded-full",
              i === current
                ? "w-8 h-2 bg-primary-400"
                : "w-2 h-2 bg-white/50 hover:bg-white/70"
            )}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Badge livraison */}
      <div className="absolute bottom-6 right-6 z-20 hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full border border-white/20">
        🚚 <span>Livraison gratuite dès 79€</span>
      </div>
    </section>
  );
}
