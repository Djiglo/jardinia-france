import { BookOpen, Package, ShoppingCart, Tag, Settings, ImageIcon, Globe, Mail, CreditCard, Database, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen size={28} className="text-primary-600" />
        <h1 className="text-2xl font-bold text-anthracite-900">Guide de démarrage</h1>
      </div>
      <p className="text-gray-500 mb-10">Tout ce que vous devez savoir pour gérer et configurer votre boutique.</p>

      {/* ── Checklist lancement ── */}
      <Section title="✅ Checklist de lancement" color="green">
        <div className="space-y-3">
          {[
            { label: "Connecter un nom de domaine", sub: "Dans Vercel → Settings → Domains, ajoutez votre domaine, puis mettez à jour NEXT_PUBLIC_APP_URL et NEXTAUTH_URL.", done: false },
            { label: "Activer Stripe en mode live", sub: "Remplacez les clés test (sk_test_… / pk_test_…) par les clés live (sk_live_… / pk_live_…) dans les variables Vercel. Créez aussi un nouveau webhook Stripe pointant vers votre vrai domaine.", done: false },
            { label: "Configurer l'email d'envoi", sub: "Dans Resend.com, ajoutez votre domaine, vérifiez-le par DNS, puis mettez à jour SMTP_FROM avec votre vrai email (ex: contact@votre-domaine.fr).", done: false },
            { label: "Ajouter vos produits", sub: "Admin → Produits → Nouveau produit. Remplissez les informations, ajoutez des photos via URL (ImgBB.com est gratuit), et publiez.", done: false },
            { label: "Personnaliser le nom de la boutique", sub: "Admin → Paramètres → modifiez le nom, l'email de contact et les infos de livraison.", done: false },
            { label: "Tester un paiement complet", sub: "En mode test Stripe, passez une vraie commande de bout en bout pour vérifier que tout fonctionne (panier → paiement → email de confirmation → commande dans l'admin).", done: false },
          ].map((item) => (
            <div key={item.label} className="flex gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <CheckCircle size={18} className="text-gray-300 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-anthracite-800 text-sm">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Gestion produits ── */}
      <Section title="📦 Gestion des produits" icon={<Package size={18} />}>
        <div className="space-y-4 text-sm text-gray-600">
          <Step n={1} title="Créer un produit">
            Allez dans <strong>Produits → Nouveau produit</strong>. Remplissez le nom (le slug est généré automatiquement), ajoutez un SKU unique (ex: BBQ-WEBER-001), une description, un prix et sélectionnez une catégorie.
          </Step>
          <Step n={2} title="Ajouter des photos">
            Les images sont ajoutées par URL. Utilisez <strong>ImgBB.com</strong> (gratuit) pour héberger vos photos : uploadez l'image → copiez le lien direct → collez-le dans le formulaire produit.
          </Step>
          <Step n={3} title="Remplir les Tags (important !)">
            Les tags servent à filtrer les produits dans les sous-catégories. Exemples :
            <ul className="mt-2 ml-4 space-y-1 list-disc">
              <li><code className="bg-gray-100 px-1 rounded">gaz</code> → Barbecue à gaz</li>
              <li><code className="bg-gray-100 px-1 rounded">charbon</code> → Barbecue à charbon</li>
              <li><code className="bg-gray-100 px-1 rounded">robot</code> → Tondeuse robot / robot piscine</li>
              <li><code className="bg-gray-100 px-1 rounded">tondeuse</code> → Tondeuse à gazon classique</li>
              <li><code className="bg-gray-100 px-1 rounded">bioclimatique</code> → Pergola bioclimatique</li>
              <li><code className="bg-gray-100 px-1 rounded">nettoyeur</code> → Nettoyeur haute pression</li>
            </ul>
          </Step>
          <Step n={4} title="Badges et mise en avant">
            Utilisez les toggles <strong>Mis en avant</strong>, <strong>Nouveau</strong> et <strong>Best-seller</strong> pour faire apparaître le produit dans les sections de la page d'accueil.
          </Step>
        </div>
      </Section>

      {/* ── Gestion commandes ── */}
      <Section title="🛒 Gestion des commandes" icon={<ShoppingCart size={18} />}>
        <div className="space-y-3 text-sm text-gray-600">
          <p>Quand un client paie, la commande est créée automatiquement via le webhook Stripe. Vous recevez aussi un email de notification.</p>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <p className="font-medium text-anthracite-700">Cycle de vie d'une commande :</p>
            {[
              ["PENDING", "En attente", "Commande créée, paiement en cours"],
              ["CONFIRMED", "Confirmée", "Paiement reçu, à préparer"],
              ["PROCESSING", "En préparation", "Vous préparez le colis"],
              ["SHIPPED", "Expédiée", "Numéro de suivi ajouté"],
              ["DELIVERED", "Livrée", "Confirmation de livraison"],
            ].map(([, label, desc]) => (
              <div key={label} className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">→</span>
                <span><strong>{label}</strong> : {desc}</span>
              </div>
            ))}
          </div>
          <p>Pour expédier une commande : cliquez dessus → renseignez le numéro de suivi → changez le statut en <strong>Expédiée</strong>.</p>
        </div>
      </Section>

      {/* ── Promotions ── */}
      <Section title="🏷️ Codes promo" icon={<Tag size={18} />}>
        <div className="space-y-3 text-sm text-gray-600">
          <p>Allez dans <strong>Promotions</strong> pour créer et gérer vos codes de réduction.</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["Pourcentage", "Ex : SUMMER20 → -20%"],
              ["Montant fixe", "Ex : PROMO10 → -10€"],
              ["Livraison offerte", "Ex : FREESHIP → livraison gratuite"],
            ].map(([type, ex]) => (
              <div key={type} className="bg-gray-50 rounded-xl p-3">
                <p className="font-medium text-anthracite-700 text-xs">{type}</p>
                <p className="text-xs text-gray-500 mt-1">{ex}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl">
            💡 Le code <strong>JARDINIA10</strong> est déjà actif (affiché sur la bannière d'accueil). Vous pouvez le modifier ou le désactiver dans Promotions.
          </p>
        </div>
      </Section>

      {/* ── Variables d'environnement ── */}
      <Section title="⚙️ Variables d'environnement Vercel" icon={<Settings size={18} />}>
        <div className="text-sm text-gray-600 space-y-3">
          <p>Toutes ces variables se configurent dans <strong>vercel.com → votre projet → Settings → Environment Variables</strong>.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-3 py-2 font-medium text-anthracite-700 rounded-l">Variable</th>
                  <th className="text-left px-3 py-2 font-medium text-anthracite-700">Description</th>
                  <th className="text-left px-3 py-2 font-medium text-anthracite-700 rounded-r">Où trouver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ["DATABASE_URL", "URL de connexion PostgreSQL", "neon.tech → votre projet → Connection string"],
                  ["NEXTAUTH_SECRET", "Clé secrète session (32+ chars aléatoires)", "Générer sur randomkeygen.com"],
                  ["NEXTAUTH_URL", "URL du site en production", "https://votre-domaine.fr"],
                  ["NEXT_PUBLIC_APP_URL", "URL du site (publique)", "https://votre-domaine.fr"],
                  ["STRIPE_SECRET_KEY", "Clé secrète Stripe (sk_live_…)", "dashboard.stripe.com → Développeurs → Clés API"],
                  ["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "Clé publique Stripe (pk_live_…)", "dashboard.stripe.com → Développeurs → Clés API"],
                  ["STRIPE_WEBHOOK_SECRET", "Secret du webhook Stripe (whsec_…)", "Stripe → Développeurs → Webhooks → votre endpoint"],
                  ["SMTP_HOST", "Serveur email", "smtp.resend.com"],
                  ["SMTP_PORT", "Port email", "465"],
                  ["SMTP_USER", "Utilisateur SMTP", "resend"],
                  ["SMTP_PASS", "Clé API Resend", "resend.com → API Keys"],
                  ["SMTP_FROM", "Expéditeur des emails", "Jardinia <contact@votre-domaine.fr>"],
                  ["ADMIN_EMAIL", "Email admin pour notifications contact", "votre@email.com"],
                ].map(([k, d, w]) => (
                  <tr key={k} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-mono text-primary-700">{k}</td>
                    <td className="px-3 py-2 text-gray-600">{d}</td>
                    <td className="px-3 py-2 text-gray-500">{w}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* ── Stripe webhook ── */}
      <Section title="💳 Configurer Stripe (live)" icon={<CreditCard size={18} />}>
        <div className="text-sm text-gray-600 space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="font-medium text-amber-800 flex items-center gap-2"><AlertTriangle size={15} /> Le site est actuellement en mode test Stripe. Les paiements réels nécessitent les clés live.</p>
          </div>
          <ol className="space-y-2 ml-4 list-decimal">
            <li>Créez un compte sur <strong>stripe.com</strong> et activez votre compte (ajoutez vos informations bancaires)</li>
            <li>Dans le tableau de bord Stripe, passez en mode <strong>Live</strong> (toggle en haut à gauche)</li>
            <li>Allez dans <strong>Développeurs → Clés API</strong> → copiez sk_live_… et pk_live_…</li>
            <li>Mettez à jour ces clés dans Vercel (STRIPE_SECRET_KEY et NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)</li>
            <li>Allez dans <strong>Développeurs → Webhooks → Ajouter un endpoint</strong></li>
            <li>URL : <code className="bg-gray-100 px-1 rounded">https://votre-domaine.fr/api/stripe/webhook</code></li>
            <li>Événement : <code className="bg-gray-100 px-1 rounded">checkout.session.completed</code></li>
            <li>Copiez le <strong>Signing secret (whsec_…)</strong> et mettez-le dans STRIPE_WEBHOOK_SECRET sur Vercel</li>
          </ol>
        </div>
      </Section>

      {/* ── Base de données ── */}
      <Section title="🗄️ Base de données (Neon)" icon={<Database size={18} />}>
        <div className="text-sm text-gray-600 space-y-2">
          <p>La base de données est hébergée sur <strong>neon.tech</strong> (PostgreSQL). Elle contient tous vos produits, commandes, clients et paramètres.</p>
          <p>Pour accéder à la base : connectez-vous sur neon.tech avec le compte associé au projet, et allez dans <strong>Tables</strong> pour voir les données.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-800 text-xs flex items-start gap-2"><Lightbulb size={14} className="shrink-0 mt-0.5" /> Le plan gratuit Neon inclut 0.5 GB de stockage et 3 GB de transfert par mois, largement suffisant pour démarrer. Vous pouvez upgrader à tout moment.</p>
          </div>
        </div>
      </Section>

      {/* ── Domaine & Email ── */}
      <Section title="🌐 Connecter un domaine" icon={<Globe size={18} />}>
        <div className="text-sm text-gray-600 space-y-2">
          <ol className="space-y-2 ml-4 list-decimal">
            <li>Achetez un domaine sur OVH, Namecheap, Gandi ou tout autre registrar</li>
            <li>Dans <strong>Vercel → Settings → Domains</strong>, ajoutez votre domaine</li>
            <li>Vercel vous donnera des enregistrements DNS → copiez-les dans votre registrar</li>
            <li>Attendez 10-30 minutes que les DNS se propagent</li>
            <li>Mettez à jour <strong>NEXT_PUBLIC_APP_URL</strong> et <strong>NEXTAUTH_URL</strong> avec votre vrai domaine</li>
            <li>Redéployez : <code className="bg-gray-100 px-1 rounded">npx vercel --prod</code></li>
          </ol>
        </div>
      </Section>

      {/* ── Email ── */}
      <Section title="📧 Configurer les emails" icon={<Mail size={18} />}>
        <div className="text-sm text-gray-600 space-y-2">
          <p>Les emails (confirmation commande, bienvenue, mot de passe oublié) sont envoyés via <strong>Resend.com</strong>.</p>
          <ol className="space-y-2 ml-4 list-decimal">
            <li>Créez un compte gratuit sur <strong>resend.com</strong></li>
            <li>Allez dans <strong>Domains</strong> → ajoutez votre domaine → vérifiez par DNS</li>
            <li>Créez une <strong>API Key</strong> → copiez la valeur (re_…)</li>
            <li>Dans Vercel, mettez à jour SMTP_PASS avec cette clé et SMTP_FROM avec <code className="bg-gray-100 px-1 rounded">Jardinia {"<"}contact@votre-domaine.fr{">"}</code></li>
          </ol>
          <p className="text-xs text-gray-500 mt-2">Le plan gratuit Resend permet 3 000 emails/mois et 100/jour.</p>
        </div>
      </Section>

      {/* ── Footer ── */}
      <div className="mt-10 p-6 bg-primary-50 rounded-2xl border border-primary-100 text-center">
        <p className="text-sm text-primary-700 font-medium">Une question sur la configuration ?</p>
        <p className="text-xs text-primary-600 mt-1">Consultez la documentation de chaque service : vercel.com/docs, stripe.com/docs, resend.com/docs</p>
      </div>
    </div>
  );
}

function Section({ title, icon, color = "white", children }: { title: string; icon?: React.ReactNode; color?: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold text-anthracite-900 mb-4 flex items-center gap-2">
        {icon && <span className="text-primary-600">{icon}</span>}
        {title}
      </h2>
      {children}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">
      <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{n}</span>
      <div>
        <p className="font-medium text-anthracite-700 mb-1">{title}</p>
        <p className="leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
