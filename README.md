# Jardinia France — E-commerce Next.js 15

> **Tout pour profiter de votre extérieur** — Boutique en ligne spécialisée jardin, piscines et espaces extérieurs.

## Stack technique

- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **Styles** : Tailwind CSS
- **Base de données** : PostgreSQL 16 via Prisma ORM
- **Auth** : NextAuth v5 (Auth.js)
- **Paiements** : Stripe
- **État global** : Zustand (panier persistant)
- **Data fetching** : React Query + Server Components
- **E-mails** : Nodemailer
- **Conteneurs** : Docker Compose

---

## Installation rapide

### Prérequis

- Node.js ≥ 20
- Docker & Docker Compose (recommandé)
- Compte Stripe
- Serveur SMTP (ex: Resend, Brevo, Gmail)

### 1. Cloner et installer les dépendances

```bash
git clone <repo> jardinia
cd jardinia
npm install
```

### 2. Configuration des variables d'environnement

```bash
cp .env.example .env
```

Éditez `.env` :

```env
# Base de données
DATABASE_URL="postgresql://jardinia:jardinia_pwd@localhost:5432/jardinia_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-32-chars-minimum"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# SMTP (exemple avec Brevo)
SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT="587"
SMTP_USER="votre@email.com"
SMTP_PASS="votre-cle-smtp"
SMTP_FROM="Jardinia France <noreply@jardinia-france.fr>"

# Admin
ADMIN_EMAIL="admin@jardinia-france.fr"

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 3. Démarrer la base de données

```bash
docker compose up -d postgres
```

### 4. Initialiser la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# Peupler avec les données de démonstration (23 produits, 8 marques, etc.)
npx prisma db seed
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Accès : http://localhost:3000

**Compte admin par défaut** (après seed) :
- E-mail : `admin@jardinia-france.fr`
- Mot de passe : `admin123!`

---

## Structure du projet

```
jardinia/
├── prisma/
│   ├── schema.prisma          # Schéma BDD complet
│   └── seed.ts                # Données de démonstration
├── src/
│   ├── app/
│   │   ├── (shop)/            # Layout boutique avec header/footer
│   │   │   ├── page.tsx       # Accueil
│   │   │   ├── boutique/      # Listing + pages produits
│   │   │   ├── panier/        # Panier
│   │   │   ├── checkout/      # Tunnel de commande
│   │   │   ├── compte/        # Espace client
│   │   │   ├── faq/           # FAQ
│   │   │   ├── contact/       # Contact
│   │   │   ├── a-propos/      # À propos
│   │   │   ├── cgv/           # CGV
│   │   │   └── mentions-legales/
│   │   ├── admin/             # Back-office (rôle ADMIN requis)
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── produits/      # Gestion produits
│   │   │   └── commandes/     # Gestion commandes
│   │   ├── auth/              # Pages connexion/inscription
│   │   └── api/               # Routes API
│   │       ├── auth/          # NextAuth + register
│   │       ├── products/      # Produits avec filtres
│   │       ├── checkout/      # Session Stripe
│   │       ├── stripe/        # Webhook
│   │       ├── coupons/       # Validation codes promo
│   │       ├── reviews/       # Avis produits
│   │       ├── search/        # Recherche instantanée
│   │       ├── newsletter/    # Inscription newsletter
│   │       └── contact/       # Formulaire contact
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   ├── home/              # Composants page d'accueil
│   │   ├── shop/              # ProductCard, Filters, Grid...
│   │   └── ui/                # LiveChat, CookieBanner
│   ├── lib/
│   │   ├── auth.ts            # Config NextAuth
│   │   ├── prisma.ts          # Client Prisma singleton
│   │   ├── stripe.ts          # Client Stripe + helpers
│   │   ├── email.ts           # Templates e-mail
│   │   └── utils.ts           # Utilitaires
│   ├── store/
│   │   └── cart.ts            # Store Zustand panier
│   ├── types/
│   │   └── index.ts           # Types TypeScript
│   ├── styles/
│   │   └── globals.css        # Tailwind + composants CSS
│   └── middleware.ts          # Protection routes
├── docker-compose.yml
├── Dockerfile
├── next.config.ts
├── tailwind.config.ts
└── .env.example
```

---

## Stripe — Configuration webhook

### Développement local

```bash
# Installer le CLI Stripe
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Production

1. Dans le dashboard Stripe → Webhooks → Ajouter un endpoint
2. URL : `https://votre-domaine.fr/api/stripe/webhook`
3. Événements à écouter :
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
4. Copier le webhook secret dans `.env` → `STRIPE_WEBHOOK_SECRET`

---

## Déploiement en production

### Option A — Docker (recommandé)

```bash
# Build et démarrage complet (app + BDD)
docker compose up -d

# Migrations et seed
docker compose exec app npx prisma db push
docker compose exec app npx prisma db seed
```

### Option B — Vercel

```bash
npm install -g vercel
vercel
```

Configurer les variables d'environnement dans le dashboard Vercel.

> ⚠️ Utiliser une base de données PostgreSQL externe (Neon, Supabase, Railway) pour Vercel.

### Option C — VPS classique

```bash
npm run build
npm start
```

Utiliser PM2 pour la gestion de processus :

```bash
npm install -g pm2
pm2 start npm --name "jardinia" -- start
pm2 save && pm2 startup
```

---

## URLs importantes

| Page | URL |
|------|-----|
| Accueil | `/` |
| Boutique | `/boutique` |
| Admin | `/admin` |
| Connexion | `/auth/connexion` |
| Mon compte | `/compte` |
| API Produits | `/api/products` |
| Webhook Stripe | `/api/stripe/webhook` |

---

## Personnalisation

### Changer la palette de couleurs
Modifier `tailwind.config.ts` → section `colors.primary` et `colors.nature`.

### Ajouter des produits
Via l'interface admin `/admin/produits` → Nouveau produit.

### Configurer les e-mails
Modifier `src/lib/email.ts` pour ajuster les templates HTML.

### Multilingue (i18n)
Le projet inclut `next-intl`. Pour activer :
1. Créer `src/messages/fr.json`, `en.json`, etc.
2. Configurer `next.config.ts`
3. Créer `src/i18n.ts`

---

## Compte admin

Après le seed, le compte admin est :
- **E-mail** : `admin@jardinia-france.fr`
- **Mot de passe** : `admin123!`

⚠️ **Changez impérativement ce mot de passe avant la mise en production !**

---

## Support

Pour toute question technique, consultez la documentation :
- [Next.js 15 docs](https://nextjs.org/docs)
- [Prisma docs](https://www.prisma.io/docs)
- [Stripe docs](https://stripe.com/docs)
- [Auth.js docs](https://authjs.dev)
