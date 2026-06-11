"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Leaf } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const NAV = [
  { label: "Piscines", href: "/boutique/piscines" },
  { label: "Mobilier de jardin", href: "/boutique/mobilier-jardin" },
  { label: "Barbecues", href: "/boutique/barbecues" },
  { label: "Tondeuses & Gazon", href: "/boutique/tondeuses-gazon" },
  { label: "Outils", href: "/boutique/outils-jardin" },
  { label: "Pergolas", href: "/boutique/decoration-exterieure" },
];

export function Header() {
  const { data: session } = useSession();
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((a, i) => a + i.quantity, 0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/boutique?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? "shadow-md" : "border-b border-gray-200"}`}>
      {/* Barre promo */}
      <div className="bg-green-600 text-white text-center text-xs py-2 px-4 font-medium">
        🚚 Livraison gratuite dès 79€ · Retours gratuits sous 30 jours · Paiement sécurisé
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-gray-900 text-base">Jardinia</span>
              <span className="block text-xs text-gray-400 -mt-0.5">FRANCE</span>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Recherche */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Rechercher"
            >
              <Search size={20} />
            </button>

            {/* Compte */}
            <Link
              href={session ? "/compte" : "/auth/connexion"}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              <User size={18} />
              <span>{session ? (session.user?.name?.split(" ")[0] ?? "Compte") : "Connexion"}</span>
            </Link>

            {/* Panier */}
            <Link
              href="/panier"
              className="relative flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">Panier</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Menu mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Barre de recherche */}
        {searchOpen && (
          <div className="pb-3">
            <form onSubmit={handleSearch} className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </form>
          </div>
        )}
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg font-medium"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 mt-2">
            <Link
              href={session ? "/compte" : "/auth/connexion"}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg font-medium"
            >
              {session ? "Mon compte" : "Connexion / Inscription"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
