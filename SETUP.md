# Jardinia France — Guide de configuration pour l'acheteur

Bienvenue ! Ce guide vous explique comment prendre en main et lancer votre boutique e-commerce **Jardinia France**.

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Base de données | PostgreSQL via Neon (neon.tech) |
| Paiements | Stripe |
| Emails | Nodemailer + Resend SMTP |
| Hébergement | Vercel |
| Auth | NextAuth v5 (JWT) |
| ORM | Prisma 5 |

---

## Étape 1 — Prérequis comptes

Créez un compte gratuit sur chaque service :

- **Vercel** → vercel.com (hébergement)
- **Neon** → neon.tech (base de données PostgreSQL)
- **Stripe** → stripe.com (paiements)
- **Resend** → resend.com (emails transactionnels)

---

## Étape 2 — Déployer sur Vercel

1. Forkez le dépôt GitHub sur votre compte
2. Sur vercel.com → **New Project** → importez votre fork
3. Configurez les variables d'environnement (voir Étape 3)
4. Cliquez sur **Deploy**

---

## Étape 3 — Variables d'environnement

Ajoutez ces variables dans **Vercel → Settings → Environment Variables** :

### Base de données (Neon)

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
```

Sur neon.tech : créez un projet → copiez la **Connection string** (pooled).

### Auth

```
NEXTAUTH_SECRET=une-chaine-aleatoire-de-32-caracteres-minimum
NEXTAUTH_URL=https://votre-domaine.fr
NEXT_PUBLIC_APP_URL=https://votre-domaine.fr
```

Générez NEXTAUTH_SECRET sur : https://randomkeygen.com (256-bit WEP key)

### Stripe

```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Voir Étape 5 pour le webhook.

### Email (Resend)

```
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=re_VOTRE_CLE_API_RESEND
SMTP_FROM=Jardinia <contact@votre-domaine.fr>
ADMIN_EMAIL=votre@email.com
```

Sur resend.com : API Keys → Create API Key → copiez la valeur.

---

## Étape 4 — Initialiser la base de données

Une fois DATABASE_URL configuré :

```bash
npm install
npx prisma generate
npx prisma db push
```

Cela crée toutes les tables. Pour peupler avec des données de démo :

```bash
npx prisma db seed
```

---

## Étape 5 — Configurer le webhook Stripe

1. Sur stripe.com → **Développeurs → Webhooks → Ajouter un endpoint**
2. URL : `https://votre-domaine.fr/api/stripe/webhook`
3. Événement : `checkout.session.completed`
4. Copiez le **Signing secret** (whsec_…) → ajoutez-le dans `STRIPE_WEBHOOK_SECRET`

⚠️ Sans ce webhook, les commandes ne sont pas enregistrées en base après paiement.

---

## Étape 6 — Créer le premier compte admin

Après le premier déploiement, inscrivez-vous normalement sur `/auth/inscription`.

Puis dans la base de données (Neon → Tables → User), modifiez votre rôle de `CUSTOMER` à `SUPER_ADMIN` :

```sql
UPDATE "User" SET role = 'SUPER_ADMIN' WHERE email = 'votre@email.com';
```

Ou via Prisma Studio (localement) :

```bash
npx prisma studio
```

---

## Étape 7 — Accéder à l'admin

URL : `https://votre-domaine.fr/admin`

Le panel admin vous permet de :
- **Produits** : ajouter, modifier, supprimer des produits
- **Commandes** : gérer le cycle de vie des commandes
- **Utilisateurs** : consulter et gérer les clients
- **Promotions** : créer des codes de réduction
- **Analytics** : chiffre d'affaires, produits populaires
- **Paramètres** : nom boutique, livraison, TVA
- **Guide** : ce guide disponible directement dans l'admin

---

## Ajouter un produit

1. Admin → **Produits → Nouveau produit**
2. Remplissez : nom, SKU, prix, catégorie, description
3. Ajoutez des images via URL (hébergez sur imgbb.com)
4. **Tags importants** pour le filtrage des sous-catégories :
   - `gaz` → barbecue à gaz
   - `charbon` → barbecue à charbon
   - `robot` → tondeuse robot / robot piscine
   - `tondeuse` → tondeuse à gazon
   - `bioclimatique` → pergola bioclimatique
   - `nettoyeur` → nettoyeur haute pression
5. Activez les toggles **Mis en avant**, **Nouveau** ou **Best-seller** pour la page d'accueil
6. Cliquez **Créer le produit**

---

## Structure des catégories

| Slug | Nom | Sous-catégories via tag |
|------|-----|------------------------|
| `piscines` | Piscines & Spas | — |
| `mobilier-jardin` | Mobilier de jardin | — |
| `barbecues` | Barbecues | `gaz`, `charbon` |
| `tondeuses-gazon` | Tondeuses & Gazon | `tondeuse`, `robot` |
| `outils-jardin` | Outils de jardin | `nettoyeur`, `engrais` |
| `pergolas` | Pergolas & Abris | `bioclimatique` |

---

## Personnaliser le site

### Nom et couleurs
- Nom boutique : Admin → Paramètres
- Couleurs : `tailwind.config.ts` → modifier `primary` (vert par défaut)

### Textes de la page d'accueil
- Bannière hero : `src/components/home/HeroBanner.tsx`
- Avantages : `src/components/home/HomeComponents.tsx` (section Advantages)
- FAQ rapide : `src/components/home/HomeComponents.tsx` (section QuickFAQ)

### Navigation / menu
- Liens du menu : `src/components/layout/Header.tsx`

---

## Fonctionnalités incluses

- ✅ Boutique avec filtres, tri et pagination
- ✅ Sous-catégories filtrables par tags
- ✅ Recherche produits en temps réel
- ✅ Page produit avec galerie photos, variantes, avis clients
- ✅ Panier persistant (localStorage)
- ✅ Codes de réduction (%, montant fixe, livraison offerte)
- ✅ Checkout Stripe (CB, Apple Pay, Google Pay)
- ✅ Livraison standard (gratuite dès 79€) + express (12,99€)
- ✅ Compte client : commandes, favoris, adresses
- ✅ Suivi commande sans compte (numéro + email)
- ✅ Emails automatiques : bienvenue, confirmation commande, mot de passe oublié
- ✅ Code de bienvenue -20% automatique à l'inscription
- ✅ Panel admin complet
- ✅ SEO : sitemap.xml, robots.txt, meta tags, JSON-LD schema.org
- ✅ Pages légales : CGV, mentions légales, politique de confidentialité, cookies

---

## Support technique

Pour toute question sur le code, le déploiement ou la configuration, consultez :
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Resend Docs](https://resend.com/docs)
- [Neon Docs](https://neon.tech/docs)
