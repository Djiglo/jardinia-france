import Link from "next/link";
import { Leaf, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo & description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <span className="font-bold text-gray-900">Jardinia France</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Votre spécialiste en produits de jardin et espaces extérieurs depuis 2024.
            </p>
            <div className="space-y-1.5 text-sm text-gray-500">
              <a href="mailto:contact@jardinia-france.fr" className="flex items-center gap-2 hover:text-green-600">
                <Mail size={14} /> contact@jardinia-france.fr
              </a>
            </div>
          </div>

          {/* Boutique */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Boutique</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {[
                ["Piscines", "/boutique/piscines"],
                ["Mobilier de jardin", "/boutique/mobilier-jardin"],
                ["Barbecues", "/boutique/barbecues"],
                ["Tondeuses & Gazon", "/boutique/tondeuses-gazon"],
                ["Outils", "/boutique/outils-jardin"],
                ["Décoration", "/boutique/decoration-exterieure"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-green-600 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mon compte */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Mon compte</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {[
                ["Connexion", "/auth/connexion"],
                ["Créer un compte", "/auth/inscription"],
                ["Mes commandes", "/compte/commandes"],
                ["Mes favoris", "/compte/favoris"],
                ["Suivre ma commande", "/compte"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-green-600 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Informations</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {[
                ["À propos", "/a-propos"],
                ["FAQ", "/faq"],
                ["Contact", "/contact"],
                ["CGV", "/cgv"],
                ["Mentions légales", "/mentions-legales"],
                ["Politique de confidentialité", "/politique-confidentialite"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-green-600 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bas de footer */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© 2025 Jardinia France — Tous droits réservés</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Paiement sécurisé</span>
            <div className="flex gap-1">
              {["Visa", "MC", "PayPal", "CB"].map((p) => (
                <span key={p} className="bg-gray-100 border border-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
