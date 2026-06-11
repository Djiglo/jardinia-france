// ================================================
// JARDINIA FRANCE - Footer
// ================================================
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
} from "lucide-react";

const footerLinks = {
  shop: {
    title: "Boutique",
    links: [
      { label: "Piscines", href: "/boutique/piscines" },
      { label: "Mobilier de jardin", href: "/boutique/mobilier-jardin" },
      { label: "Barbecues", href: "/boutique/barbecues" },
      { label: "Tondeuses & Gazon", href: "/boutique/tondeuses-gazon" },
      { label: "Outils de jardin", href: "/boutique/outils-jardin" },
      { label: "Décoration extérieure", href: "/boutique/decoration-exterieure" },
    ],
  },
  account: {
    title: "Mon compte",
    links: [
      { label: "Tableau de bord", href: "/compte" },
      { label: "Mes commandes", href: "/compte/commandes" },
      { label: "Mes favoris", href: "/compte/favoris" },
      { label: "Suivi de commande", href: "/suivi-commande" },
      { label: "Connexion", href: "/auth/connexion" },
      { label: "Créer un compte", href: "/auth/inscription" },
    ],
  },
  info: {
    title: "Informations",
    links: [
      { label: "À propos de nous", href: "/a-propos" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Livraison & Retours", href: "/livraison" },
      { label: "Conditions générales", href: "/cgv" },
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Politique de confidentialité", href: "/confidentialite" },
      { label: "Gestion des cookies", href: "/cookies" },
    ],
  },
};

const advantages = [
  {
    icon: Truck,
    title: "Livraison gratuite",
    description: "Dès 79€ d'achat",
  },
  {
    icon: RotateCcw,
    title: "Retours faciles",
    description: "30 jours pour changer d'avis",
  },
  {
    icon: ShieldCheck,
    title: "Paiement sécurisé",
    description: "Stripe SSL - 100% sécurisé",
  },
  {
    icon: Star,
    title: "Service client",
    description: "Réponse sous 24h",
  },
];

export function Footer() {
  return (
    <footer className="bg-anthracite-950 text-gray-300">
      {/* ========================
          Avantages
          ======================== */}
      <div className="border-b border-anthracite-800">
        <div className="container-custom py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {advantages.map((adv) => (
              <div key={adv.title} className="flex items-start gap-3">
                <div className="p-2 bg-primary-600/20 rounded-lg shrink-0">
                  <adv.icon size={20} className="text-primary-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{adv.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{adv.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================
          Liens footer
          ======================== */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Colonne marque */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <div>
                <div className="font-heading font-bold text-xl text-white">Jardinia</div>
                <div className="text-xs text-primary-400 font-medium">FRANCE</div>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              Votre spécialiste en produits pour le jardin, les espaces extérieurs et
              l'aménagement de la maison. Livraison dans toute l'Europe.
            </p>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com/jardiniafrance"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-anthracite-800 hover:bg-primary-700 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com/jardiniafrance"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-anthracite-800 hover:bg-primary-700 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://youtube.com/@jardiniafrance"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-anthracite-800 hover:bg-primary-700 rounded-lg transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://twitter.com/jardiniafrance"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-anthracite-800 hover:bg-primary-700 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>

            {/* Coordonnées */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={14} className="shrink-0" />
                <span>Île-de-France, France</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone size={14} className="shrink-0" />
                <a href="tel:+33000000000" className="hover:text-white transition-colors">
                  À configurer
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={14} className="shrink-0" />
                <a
                  href="mailto:contact@jardinia-france.com"
                  className="hover:text-white transition-colors"
                >
                  contact@jardinia-france.com
                </a>
              </div>
            </div>
          </div>

          {/* Colonnes liens */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-heading font-semibold text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ========================
          Barre bas
          ======================== */}
      <div className="border-t border-anthracite-800">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Jardinia France. Tous droits réservés.
            Créée en 2024.
          </p>
          <div className="flex items-center gap-4">
            {/* Icônes paiement */}
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-white rounded text-xs font-bold text-blue-800">
                VISA
              </div>
              <div className="px-2 py-1 bg-white rounded text-xs font-bold text-orange-600">
                MC
              </div>
              <div className="px-2 py-1 bg-[#003087] rounded text-xs font-bold text-white">
                PayPal
              </div>
              <div className="px-2 py-1 bg-black rounded text-xs font-bold text-white">
                Apple Pay
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
