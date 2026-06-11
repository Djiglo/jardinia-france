"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

const FAQ_DATA = [
  {
    category: "Livraison",
    questions: [
      { q: "Quels sont les délais de livraison ?", a: "La livraison standard prend 3 à 5 jours ouvrés. La livraison express est disponible en 1 à 2 jours ouvrés. Ces délais s'entendent à compter de la confirmation de commande." },
      { q: "La livraison est-elle gratuite ?", a: "Oui ! La livraison est offerte pour toute commande de 79€ ou plus. En dessous de ce seuil, les frais de livraison standard sont de 5,99€ et la livraison express de 12,99€." },
      { q: "Livrez-vous en dehors de la France ?", a: "Oui, nous livrons dans toute l'Europe. Les délais et tarifs peuvent varier selon le pays de destination." },
      { q: "Comment suivre ma commande ?", a: "Vous recevrez un e-mail avec un lien de suivi dès l'expédition de votre commande. Vous pouvez également consulter le statut dans votre espace client, rubrique 'Mes commandes'." },
    ],
  },
  {
    category: "Commandes et paiement",
    questions: [
      { q: "Quels modes de paiement acceptez-vous ?", a: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal, Apple Pay et Google Pay via notre plateforme de paiement sécurisée Stripe." },
      { q: "Mon paiement est-il sécurisé ?", a: "Absolument. Tous les paiements sont traités par Stripe, certifié PCI DSS niveau 1, le standard le plus élevé en matière de sécurité des paiements. Vos données bancaires ne sont jamais stockées sur nos serveurs." },
      { q: "Puis-je modifier ou annuler ma commande ?", a: "Une commande peut être modifiée ou annulée dans les 2 heures suivant sa validation, avant expédition. Contactez-nous rapidement par e-mail ou via le chat." },
      { q: "Comment utiliser un code de réduction ?", a: "Sur la page panier, saisissez votre code de réduction dans le champ prévu à cet effet et cliquez sur 'Appliquer'. La réduction sera immédiatement calculée." },
    ],
  },
  {
    category: "Retours et remboursements",
    questions: [
      { q: "Quel est votre politique de retour ?", a: "Vous disposez de 30 jours à compter de la réception pour retourner un article, dans son emballage d'origine et en parfait état. Les frais de retour sont à votre charge." },
      { q: "Comment initier un retour ?", a: "Connectez-vous à votre espace client, accédez à 'Mes commandes', sélectionnez l'article concerné et cliquez sur 'Retourner cet article'. Suivez ensuite les instructions." },
      { q: "Quand serai-je remboursé ?", a: "Le remboursement est effectué sous 5 à 10 jours ouvrés après réception et vérification du retour, sur le moyen de paiement utilisé lors de l'achat." },
    ],
  },
  {
    category: "Produits",
    questions: [
      { q: "Les avis clients sont-ils vérifiés ?", a: "Oui, les avis identifiés comme 'Achat vérifié' proviennent uniquement de clients ayant effectivement acheté le produit. Tous les avis sont modérés avant publication." },
      { q: "Un produit peut-il être en rupture de stock ?", a: "Oui, certains articles très demandés peuvent être temporairement indisponibles. Vous pouvez activer une alerte réapprovisionnement sur la fiche produit." },
      { q: "Les photos sont-elles contractuelles ?", a: "Oui, les photos des produits sont contractuelles et représentent fidèlement les articles vendus. En cas de doute, n'hésitez pas à nous contacter avant l'achat." },
    ],
  },
  {
    category: "Compte client",
    questions: [
      { q: "Comment créer un compte ?", a: "Cliquez sur 'Connexion' puis 'Créer un compte'. Remplissez le formulaire avec vos informations. La création est gratuite et vous permet de suivre vos commandes, gérer vos favoris et accélérer vos achats." },
      { q: "J'ai oublié mon mot de passe", a: "Sur la page de connexion, cliquez sur 'Mot de passe oublié ?'. Vous recevrez un lien de réinitialisation par e-mail dans quelques minutes (vérifiez aussi vos spams)." },
      { q: "Comment supprimer mon compte ?", a: "Pour supprimer votre compte, contactez-nous par e-mail en précisant votre adresse e-mail de connexion. La suppression est définitive et sera effectuée sous 30 jours." },
    ],
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggle = (key: string) =>
    setOpenItems((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);

  const filtered = FAQ_DATA.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) =>
        !search ||
        q.q.toLowerCase().includes(search.toLowerCase()) ||
        q.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-anthracite-900 mb-3">Questions fréquentes</h1>
        <p className="text-gray-500">Trouvez rapidement une réponse à vos questions</p>
      </div>

      {/* Recherche */}
      <div className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher dans la FAQ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p>Aucun résultat pour "{search}"</p>
          <button onClick={() => setSearch("")} className="text-primary-600 text-sm mt-2 hover:underline">
            Effacer la recherche
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {filtered.map((cat) => (
            <section key={cat.category}>
              <h2 className="text-lg font-semibold text-anthracite-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {cat.questions.length}
                </span>
                {cat.category}
              </h2>
              <div className="space-y-2">
                {cat.questions.map((item) => {
                  const key = cat.category + item.q;
                  const isOpen = openItems.includes(key);
                  return (
                    <div key={key} className="card overflow-hidden">
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-anthracite-700 pr-4">{item.q}</span>
                        {isOpen ? <ChevronUp size={18} className="text-primary-600 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="mt-12 card p-6 text-center bg-primary-50 border-primary-100">
        <p className="font-medium text-anthracite-800 mb-1">Vous ne trouvez pas votre réponse ?</p>
        <p className="text-sm text-gray-500 mb-4">Notre équipe est là pour vous aider</p>
        <a href="/contact" className="btn-primary inline-flex">Nous contacter</a>
      </div>
    </div>
  );
}
