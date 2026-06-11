import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Jardinia France",
  description: "Comment nous collectons, utilisons et protégeons vos données personnelles.",
};

export default function ConfidentialitePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-anthracite-900 mb-2">Politique de confidentialité</h1>
      <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : janvier 2025</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">1. Responsable du traitement</h2>
          <p className="text-gray-700">
            Jardinia France, société dont le siège social est situé en Île-de-France, est responsable du traitement
            de vos données personnelles collectées sur ce site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">2. Données collectées</h2>
          <p className="text-gray-700 mb-3">Nous collectons les données suivantes :</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Informations d&apos;identité : nom, prénom, adresse e-mail</li>
            <li>Coordonnées : adresse postale, numéro de téléphone</li>
            <li>Données de commande : articles achetés, montants, historique</li>
            <li>Données de connexion : adresse IP, type de navigateur, pages visitées</li>
            <li>Données de paiement : traitées directement par Stripe (nous n&apos;avons pas accès à vos données bancaires)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">3. Finalités du traitement</h2>
          <p className="text-gray-700 mb-3">Vos données sont utilisées pour :</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Gérer votre compte client et vos commandes</li>
            <li>Traiter les paiements en toute sécurité</li>
            <li>Vous envoyer des confirmations de commande et mises à jour de livraison</li>
            <li>Améliorer notre site et nos services</li>
            <li>Vous envoyer des offres commerciales (avec votre consentement)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">4. Conservation des données</h2>
          <p className="text-gray-700">
            Vos données personnelles sont conservées pendant la durée nécessaire à la finalité pour laquelle elles
            ont été collectées, et au maximum 3 ans après votre dernière interaction avec notre service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">5. Vos droits (RGPD)</h2>
          <p className="text-gray-700 mb-3">Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li><strong>Droit d&apos;accès</strong> : obtenir une copie de vos données</li>
            <li><strong>Droit de rectification</strong> : corriger vos données inexactes</li>
            <li><strong>Droit à l&apos;effacement</strong> : demander la suppression de vos données</li>
            <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
            <li><strong>Droit d&apos;opposition</strong> : vous opposer au traitement de vos données</li>
          </ul>
          <p className="text-gray-700 mt-3">
            Pour exercer ces droits, contactez-nous à :{" "}
            <a href="mailto:contact@jardinia-france.com" className="text-primary-600 hover:underline">
              contact@jardinia-france.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">6. Cookies</h2>
          <p className="text-gray-700">
            Notre site utilise des cookies pour améliorer votre expérience. Consultez notre{" "}
            <a href="/cookies" className="text-primary-600 hover:underline">politique de cookies</a> pour plus d&apos;informations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">7. Contact</h2>
          <p className="text-gray-700">
            Pour toute question relative à la protection de vos données, vous pouvez nous contacter à{" "}
            <a href="mailto:contact@jardinia-france.com" className="text-primary-600 hover:underline">
              contact@jardinia-france.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
