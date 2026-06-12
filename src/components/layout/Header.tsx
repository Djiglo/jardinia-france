"use client";
// ================================================
// JARDINIA FRANCE - Header Principal
// ================================================
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Heart,
  Package,
  LogOut,
  Settings,
  Phone,
  Mail,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";

const navCategories = [
  {
    label: "Piscines",
    href: "/boutique/piscines",
    children: [
      { label: "Toutes les piscines", href: "/boutique/piscines" },
      { label: "Entretien piscine", href: "/boutique/entretien-piscine" },
    ],
  },
  {
    label: "Mobilier de jardin",
    href: "/boutique/mobilier-jardin",
    children: [
      { label: "Tables de jardin", href: "/boutique/tables-jardin" },
      { label: "Chaises & Bancs", href: "/boutique/chaises-bancs" },
      { label: "Parasols & Tonnelles", href: "/boutique/parasols" },
      { label: "Salons de jardin", href: "/boutique/mobilier-jardin" },
    ],
  },
  {
    label: "Barbecues",
    href: "/boutique/barbecues",
    children: [
      { label: "Barbecues à gaz", href: "/boutique/barbecues?type=gaz" },
      { label: "Barbecues charbon", href: "/boutique/barbecues?type=charbon" },
      { label: "Planchas", href: "/boutique/barbecues?type=plancha" },
    ],
  },
  {
    label: "Tondeuses & Gazon",
    href: "/boutique/tondeuses-gazon",
    children: [
      { label: "Tondeuses", href: "/boutique/tondeuses-gazon" },
      { label: "Robots tondeuses", href: "/boutique/tondeuses-gazon?type=robot" },
      { label: "Engrais & Semences", href: "/boutique/tondeuses-gazon?type=engrais" },
    ],
  },
  {
    label: "Outils",
    href: "/boutique/outils-jardin",
    children: [
      { label: "Outils de jardin", href: "/boutique/outils-jardin" },
      { label: "Nettoyeurs HP", href: "/boutique/outils-jardin?type=nettoyeur" },
    ],
  },
  {
    label: "Décoration",
    href: "/boutique/decoration-exterieure",
    children: [
      { label: "Éclairage extérieur", href: "/boutique/eclairage-exterieur" },
      { label: "Décoration & Accessoires", href: "/boutique/decoration-exterieure" },
    ],
  },
];

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openNav = useCallback((href: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveNav(href);
  }, []);

  const closeNav = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveNav(null), 180);
  }, []);
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
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
    <>
      {/* ========================
          Barre supérieure
          ======================== */}
      <div className="bg-primary-700 text-white text-xs py-2 hidden md:block">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone size={12} />
              <a href="tel:+33000000000" className="hover:text-primary-200">
                À configurer
              </a>
            </span>
            <span className="flex items-center gap-1">
              <Mail size={12} />
              <a href="mailto:contact@jardinia-france.com" className="hover:text-primary-200">
                contact@jardinia-france.com
              </a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>🚚 Livraison gratuite dès 79€</span>
            <span>🇪🇺 Livraison dans toute l'Europe</span>
          </div>
        </div>
      </div>

      {/* ========================
          Header principal
          ======================== */}
      <header
        className={cn(
          "sticky top-0 z-50 bg-white transition-shadow duration-300",
          scrolled ? "shadow-md" : "shadow-sm"
        )}
      >
        <div className="container-custom">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🌿</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-heading font-bold text-lg text-anthracite-900 leading-tight">
                  Jardinia
                </div>
                <div className="text-[10px] text-primary-600 font-medium -mt-0.5">
                  FRANCE
                </div>
              </div>
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navCategories.map((cat) => (
                <div
                  key={cat.href}
                  className="relative"
                  onMouseEnter={() => openNav(cat.href)}
                  onMouseLeave={closeNav}
                >
                  <Link
                    href={cat.href}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      activeNav === cat.href
                        ? "text-primary-700 bg-primary-50"
                        : "text-anthracite-700 hover:text-primary-700 hover:bg-gray-50"
                    )}
                  >
                    {cat.label}
                    <ChevronDown
                      size={14}
                      className={cn(
                        "transition-transform duration-200",
                        activeNav === cat.href ? "rotate-180" : ""
                      )}
                    />
                  </Link>

                  {/* Pont invisible qui couvre le gap entre bouton et dropdown */}
                  {activeNav === cat.href && (
                    <div className="absolute top-full left-0 w-full h-2 z-50" />
                  )}

                  {/* Dropdown */}
                  {cat.children && activeNav === cat.href && (
                    <div
                      className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                      onMouseEnter={() => openNav(cat.href)}
                      onMouseLeave={closeNav}
                    >
                      {cat.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setActiveNav(null)}
                          className="block px-4 py-2.5 text-sm text-anthracite-700 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions droite */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Bouton recherche */}
              <button
                onClick={() => setSearchOpen(true)}
                className="btn-icon hidden sm:flex"
                aria-label="Rechercher"
              >
                <Search size={20} className="text-anthracite-600" />
              </button>

              {/* Liste d'envies */}
              {session && (
                <Link
                  href="/compte/favoris"
                  className="btn-icon hidden sm:flex"
                  aria-label="Mes favoris"
                >
                  <Heart size={20} className="text-anthracite-600" />
                </Link>
              )}

              {/* Panier */}
              <Link
                href="/panier"
                className="btn-icon relative"
                aria-label="Panier"
              >
                <ShoppingCart size={20} className="text-anthracite-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Compte */}
              {session ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 text-xs font-bold">
                        {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-anthracite-700 hidden md:block">
                      {session.user.name?.split(" ")[0] || "Mon compte"}
                    </span>
                    <ChevronDown size={14} className="text-gray-400 hidden md:block" />
                  </button>

                  {/* Dropdown compte */}
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      href="/compte"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-anthracite-700 hover:text-primary-700 hover:bg-primary-50"
                    >
                      <User size={16} />
                      Mon compte
                    </Link>
                    <Link
                      href="/compte/commandes"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-anthracite-700 hover:text-primary-700 hover:bg-primary-50"
                    >
                      <Package size={16} />
                      Mes commandes
                    </Link>
                    <Link
                      href="/compte/favoris"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-anthracite-700 hover:text-primary-700 hover:bg-primary-50"
                    >
                      <Heart size={16} />
                      Mes favoris
                    </Link>
                    {(session.user.role === "ADMIN" ||
                      session.user.role === "SUPER_ADMIN") && (
                      <>
                        <hr className="my-2 border-gray-100" />
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-anthracite-700 hover:text-primary-700 hover:bg-primary-50"
                        >
                          <Settings size={16} />
                          Administration
                        </Link>
                      </>
                    )}
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={16} />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/auth/connexion" className="btn-primary btn-sm hidden sm:flex">
                  <User size={16} />
                  Connexion
                </Link>
              )}

              {/* Burger mobile */}
              <button
                onClick={() => setMobileOpen(true)}
                className="btn-icon lg:hidden"
                aria-label="Menu"
              >
                <Menu size={22} className="text-anthracite-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================
          Search Overlay
          ======================== */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <form onSubmit={handleSearch} className="flex items-center p-4 gap-3">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit (piscine, barbecue, tondeuse...)"
                className="flex-1 text-lg outline-none text-anthracite-900 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </form>
            <div className="border-t border-gray-100 px-4 py-3">
              <p className="text-xs text-gray-500 mb-2">Recherches populaires :</p>
              <div className="flex flex-wrap gap-2">
                {["Piscine", "Barbecue Weber", "Tondeuse robot", "Parasol", "Table de jardin"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        router.push(`/boutique?search=${encodeURIComponent(term)}`);
                        setSearchOpen(false);
                      }}
                      className="px-3 py-1 bg-gray-100 hover:bg-primary-100 hover:text-primary-700 text-sm rounded-full transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================
          Menu Mobile
          ======================== */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div
            className="flex-1 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="w-80 bg-white h-full overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌿</span>
                <span className="font-heading font-bold text-lg">Jardinia France</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="btn-icon">
                <X size={20} />
              </button>
            </div>

            {/* Search mobile */}
            <div className="p-4 border-b">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/boutique?search=${encodeURIComponent(searchQuery)}`);
                    setMobileOpen(false);
                  }
                }}
                className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2"
              >
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="flex-1 bg-transparent text-sm outline-none"
                />
              </form>
            </div>

            {/* Nav categories */}
            <nav className="p-4">
              {navCategories.map((cat) => (
                <div key={cat.href} className="mb-4">
                  <Link
                    href={cat.href}
                    onClick={() => setMobileOpen(false)}
                    className="block font-semibold text-anthracite-900 mb-1 hover:text-primary-700"
                  >
                    {cat.label}
                  </Link>
                  {cat.children && (
                    <div className="ml-3 space-y-1">
                      {cat.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block text-sm text-gray-600 hover:text-primary-600 py-0.5"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <hr className="border-gray-100" />

            {/* Mobile auth */}
            <div className="p-4 space-y-2">
              {session ? (
                <>
                  <Link
                    href="/compte"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2 text-anthracite-700"
                  >
                    <User size={18} />
                    Mon compte
                  </Link>
                  <Link
                    href="/compte/commandes"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2 text-anthracite-700"
                  >
                    <Package size={18} />
                    Mes commandes
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 py-2 text-red-600 w-full text-left"
                  >
                    <LogOut size={18} />
                    Se déconnecter
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/connexion"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary w-full"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/inscription"
                    onClick={() => setMobileOpen(false)}
                    className="btn-secondary w-full"
                  >
                    Créer un compte
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
