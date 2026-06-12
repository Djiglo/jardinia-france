import { Metadata } from "next";
import { Truck, Clock, MapPin, RotateCcw, Package, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Livraison & Retours | Jardinia France",
  description: "Tout savoir sur nos modes de livraison, délais et politique de retour.",
};

export default function LivraisonPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-anthracite-900 mb-2">Livraison & Retours</h1>
      <p className="text-gray-500 mb-10">Tout ce que vous devez savoir sur la livraison de vos commandes.</p>

      {/* Modes de livraison */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-anthracite-800 mb-6 flex items-center gap-2">
          <Truck size={20} className="text-primary-600" /> Modes de livraison
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-2xl p-6">
            <h3 className="font-semibold text-anthracite-800 mb-1">Livraison standard</h3>
            <p className="text-2xl font-bold text-primary-600 mb-1">5,99 €</p>
            <p className="text-sm text-gray-500 mb-3">Gratuite dès 79 € d&apos;achats</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={14} /> 3 à 5 jours ouvrés
            </div>
          </div>
          <div className="border border-primary-200 bg-primary-50 rounded-2xl p-6">
            <h3 className="font-semibold text-anthracite-800 mb-1">Livraison express</h3>
            <p className="text-2xl font-bold text-primary-600 mb-1">12,99 €</p>
            <p className="text-sm text-gray-500 mb-3">Pour recevoir votre commande rapidement</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={14} /> 1 à 2 jours ouvrés
            </div>
          </div>
        </div>
      </section>

      {/* Zones de livraison */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-anthracite-800 mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-primary-600" /> Zones de livraison
        </h2>
        <div className="bg-gray-50 rounded-2xl p-6">
          <p className="text-gray-700 mb-4">
            Nous livrons dans toute la France métropolitaine et dans les pays de l&apos;Union Européenne.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2"><Package size={14} className="text-primary-500" /> France métropolitaine</li>
            <li className="flex items-center gap-2"><Package size={14} className="text-primary-500" /> Belgique, Luxembourg, Suisse</li>
            <li className="flex items-center gap-2"><Package size={14} className="text-primary-500" /> Allemagne, Espagne, Italie, Pays-Bas</li>
            <li className="flex items-center gap-2"><Package size={14} className="text-primary-500" /> Autres pays UE (délais variables)</li>
          </ul>
        </div>
      </section>

      {/* Politique de retours */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-anthracite-800 mb-4 flex items-center gap-2">
          <RotateCcw size={20} className="text-primary-600" /> Politique de retours
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Vous disposez de <strong>30 jours</strong> à compter de la réception de votre commande pour nous retourner
            tout article qui ne vous convient pas, sous réserve qu&apos;il soit dans son état d&apos;origine.
          </p>
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
            <h3 className="font-semibold text-primary-700 mb-2">Comment effectuer un retour ?</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Connectez-vous à votre espace client</li>
              <li>Rendez-vous dans &quot;Mes commandes&quot; et sélectionnez l&apos;article à retourner</li>
              <li>Imprimez l&apos;étiquette de retour prépayée</li>
              <li>Déposez votre colis en point relais</li>
            </ol>
          </div>
          <p className="text-sm text-gray-500">
            Le remboursement est effectué sous 5 à 10 jours ouvrés après réception et vérification de l&apos;article.
          </p>
        </div>
      </section>

      {/* Note */}
      <div className="flex gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
        <AlertCircle size={16} className="shrink-0 mt-0.5" />
        <p>
          Certains articles volumineux (piscines hors-sol, mobilier de jardin) font l&apos;objet d&apos;une livraison
          spéciale. Les délais peuvent varier. Contactez-nous pour plus d&apos;informations.
        </p>
      </div>
    </div>
  );
}
