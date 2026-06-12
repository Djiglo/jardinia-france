import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente | Jardinia France",
  description: "Consultez les conditions générales de vente de Jardinia France.",
};

export default function CGVPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-anthracite-900 mb-2">Conditions Générales de Vente</h1>
      <p className="text-gray-500 mb-8">Dernière mise à jour : juin 2026</p>
      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">Article 1 — Objet</h2>
          <p className="text-gray-600 leading-relaxed">Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre la société Jardinia France, auto-entrepreneur immatriculé en France, et tout acheteur effectuant un achat sur le site jardinia-france.fr. Toute commande implique l'acceptation sans réserve des présentes CGV.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">Article 2 — Produits</h2>
          <p className="text-gray-600 leading-relaxed">Les produits proposés à la vente sont ceux figurant sur le site au moment de la consultation. Les photos des produits sont contractuelles. En cas d'erreur manifeste, Jardinia France ne pourra en être tenu responsable. Les caractéristiques essentielles des produits sont présentées dans chaque fiche produit.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">Article 3 — Prix</h2>
          <p className="text-gray-600 leading-relaxed">Les prix sont indiqués en euros TTC. Jardinia France se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix applicable à la commande est celui en vigueur au moment de la validation de celle-ci.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">Article 4 — Commande</h2>
          <p className="text-gray-600 leading-relaxed">Toute commande vaut acceptation des prix et descriptions des produits disponibles à la vente. La commande n'est définitive qu'après confirmation du paiement. Un e-mail de confirmation est envoyé à l'adresse fournie lors de la commande.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">Article 5 — Livraison</h2>
          <p className="text-gray-600 leading-relaxed">La livraison est effectuée dans toute l'Europe. Les délais indicatifs sont de 3 à 5 jours ouvrés pour la livraison standard, et de 1 à 2 jours ouvrés pour la livraison express. La livraison est gratuite pour toute commande dépassant 79€. En cas de retard, Jardinia France ne pourra pas être tenu responsable des préjudices indirects.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">Article 6 — Droit de rétractation</h2>
          <p className="text-gray-600 leading-relaxed">Conformément à la législation en vigueur, le client dispose d'un délai de 14 jours à compter de la réception du produit pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités. Les frais de retour sont à la charge du client.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">Article 7 — Garantie</h2>
          <p className="text-gray-600 leading-relaxed">Tous les produits bénéficient de la garantie légale de conformité de 2 ans et de la garantie légale contre les vices cachés. Pour toute demande de garantie, contactez notre service client.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-anthracite-800 mb-3">Article 8 — Litiges</h2>
          <p className="text-gray-600 leading-relaxed">En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront seuls compétents, le droit français étant seul applicable.</p>
        </section>
      </div>
    </div>
  );
}
