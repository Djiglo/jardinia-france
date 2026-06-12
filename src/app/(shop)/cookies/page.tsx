import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestion des cookies | Jardinia France",
  description: "Notre politique d'utilisation des cookies et comment les gérer.",
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-anthracite-900 mb-2">Gestion des cookies</h1>
      <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : juin 2026</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">Qu&apos;est-ce qu&apos;un cookie ?</h2>
          <p className="text-gray-700">
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone)
            lors de votre visite sur notre site. Il permet à notre site de mémoriser vos préférences et
            d&apos;améliorer votre expérience de navigation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-4">Types de cookies utilisés</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-anthracite-700">Cookies essentiels</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  Toujours actifs
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Indispensables au fonctionnement du site : gestion de votre session, de votre panier,
                et de la sécurité. Ces cookies ne peuvent pas être désactivés.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-anthracite-700">Cookies de performance</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  Optionnels
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Nous permettent de mesurer l&apos;audience et d&apos;analyser le trafic pour améliorer notre site
                (via des outils d&apos;analyse anonymisés).
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-anthracite-700">Cookies de personnalisation</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  Optionnels
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Mémorisent vos préférences (langue, région) pour personnaliser votre expérience.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">Durée de conservation</h2>
          <p className="text-gray-700">
            Les cookies sont conservés pour une durée maximale de 13 mois, conformément aux recommandations
            de la CNIL.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">Comment gérer vos cookies ?</h2>
          <p className="text-gray-700 mb-4">
            Vous pouvez à tout moment modifier vos préférences en matière de cookies via les paramètres
            de votre navigateur :
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <strong>Chrome</strong> : Paramètres › Confidentialité et sécurité › Cookies et autres données des sites
            </li>
            <li>
              <strong>Firefox</strong> : Paramètres › Vie privée et sécurité › Cookies et données de sites
            </li>
            <li>
              <strong>Safari</strong> : Préférences › Confidentialité › Gérer les données du site web
            </li>
            <li>
              <strong>Edge</strong> : Paramètres › Confidentialité, recherche et services › Cookies
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">Contact</h2>
          <p className="text-gray-700">
            Pour toute question sur notre utilisation des cookies, contactez-nous à{" "}
            <a href="mailto:contact@jardinia-france.fr" className="text-primary-600 hover:underline">
              contact@jardinia-france.fr
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
