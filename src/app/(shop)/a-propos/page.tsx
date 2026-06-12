import { Metadata } from "next";
import Link from "next/link";
import { Leaf, Users, Calendar, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "À propos de Jardinia France | Votre spécialiste jardin",
  description: "Découvrez l'histoire de Jardinia France, votre spécialiste en produits de jardin, piscine et espaces extérieurs.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 text-primary-600 font-semibold mb-4">
          <Leaf size={20} />
          <span className="uppercase tracking-widest text-sm">Notre histoire</span>
        </div>
        <h1 className="text-4xl font-bold text-anthracite-900 mb-4">
          Bienvenue chez <span className="text-primary-600">Jardinia France</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Votre destination e-commerce dédiée aux espaces extérieurs, créée avec passion pour rendre chaque jardin unique.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {[
          { icon: Calendar, value: "2024", label: "Année de création" },
          { icon: Users, value: "2", label: "Collaborateurs passionnés" },
          { icon: Globe, value: "Europe", label: "Zone de livraison" },
          { icon: Leaf, value: "500+", label: "Produits référencés" },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="card p-5 text-center">
            <Icon size={28} className="text-primary-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-anthracite-800">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Notre mission */}
      <div className="prose prose-green max-w-none mb-16">
        <h2 className="text-2xl font-bold text-anthracite-800 mb-4">Notre mission</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Chez Jardinia France, nous croyons que chaque espace extérieur mérite d'être un lieu de vie agréable, fonctionnel et esthétique. 
          Fondée en 2024 par des passionnés de jardin et d'aménagement extérieur, notre boutique en ligne s'est donnée pour mission de vous offrir les meilleurs produits aux meilleurs prix.
        </p>
        <p className="text-gray-600 leading-relaxed mb-4">
          Que vous soyez propriétaire d'un grand jardin, locataire avec un balcon, ou professionnel du paysagisme, nous avons sélectionné pour vous une gamme complète de produits : mobilier de jardin, piscines, barbecues, outillage, décoration extérieure et bien plus encore.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Notre engagement ? Vous proposer une expérience d'achat fluide, des produits de qualité, et un service client réactif. La livraison est gratuite dès 79€ et nous livrons dans toute l'Europe.
        </p>
      </div>

      {/* Valeurs */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-anthracite-800 mb-6">Nos valeurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { emoji: "🌿", title: "Qualité", desc: "Nous sélectionnons rigoureusement chaque produit pour vous garantir durabilité et satisfaction." },
            { emoji: "🚚", title: "Service", desc: "Livraison rapide, retours facilités, support client disponible — votre satisfaction est notre priorité." },
            { emoji: "💚", title: "Engagement", desc: "Nous favorisons les marques engagées dans des pratiques durables et respectueuses de l'environnement." },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="card p-5">
              <div className="text-3xl mb-3">{emoji}</div>
              <h3 className="font-semibold text-anthracite-800 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
