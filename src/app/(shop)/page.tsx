// ================================================
// JARDINIA FRANCE - Page d'Accueil
// ================================================
import type { Metadata } from "next";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BestSellers } from "@/components/home/BestSellers";
import { NewProducts } from "@/components/home/NewProducts";
import { Testimonials } from "@/components/home/Testimonials";
import { Advantages } from "@/components/home/Advantages";
import { Newsletter } from "@/components/home/Newsletter";
import { PromoBanner } from "@/components/home/PromoBanner";
import { QuickFAQ } from "@/components/home/QuickFAQ";

export const metadata: Metadata = {
  title: "Jardinia France - Tout pour profiter de votre extérieur",
  description:
    "Découvrez notre sélection de piscines, mobilier de jardin, barbecues, tondeuses et accessoires extérieurs. Livraison gratuite dès 79€ dans toute l'Europe.",
};

export default async function HomePage() {
  return (
    <>
      {/* Hero Banner principal */}
      <HeroBanner />

      {/* Bannière promotionnelle */}
      <PromoBanner />

      {/* Catégories populaires */}
      <FeaturedCategories />

      {/* Produits vedettes */}
      <FeaturedProducts />

      {/* Best sellers */}
      <BestSellers />

      {/* Nouveautés */}
      <NewProducts />

      {/* Avantages */}
      <Advantages />

      {/* Témoignages clients */}
      <Testimonials />

      {/* FAQ rapide */}
      <QuickFAQ />

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}
