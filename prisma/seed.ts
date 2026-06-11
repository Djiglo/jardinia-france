// ================================================
// JARDINIA FRANCE - Données de démarrage (Seed)
// ================================================
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Initialisation des données Jardinia France...");

  // ========================
  // ADMIN
  // ========================
  const adminPassword = await bcrypt.hash("Admin@Jardinia2024!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@jardinia-france.com" },
    update: {},
    create: {
      email: "admin@jardinia-france.com",
      name: "Administrateur Jardinia",
      firstName: "Admin",
      lastName: "Jardinia",
      password: adminPassword,
      role: UserRole.SUPER_ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log("✅ Admin créé:", admin.email);

  // ========================
  // MARQUES
  // ========================
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: "intex" },
      update: {},
      create: { name: "Intex", slug: "intex", isActive: true },
    }),
    prisma.brand.upsert({
      where: { slug: "bestway" },
      update: {},
      create: { name: "Bestway", slug: "bestway", isActive: true },
    }),
    prisma.brand.upsert({
      where: { slug: "weber" },
      update: {},
      create: { name: "Weber", slug: "weber", isActive: true },
    }),
    prisma.brand.upsert({
      where: { slug: "bosch" },
      update: {},
      create: { name: "Bosch", slug: "bosch", isActive: true },
    }),
    prisma.brand.upsert({
      where: { slug: "husqvarna" },
      update: {},
      create: { name: "Husqvarna", slug: "husqvarna", isActive: true },
    }),
    prisma.brand.upsert({
      where: { slug: "jardinia-pro" },
      update: {},
      create: { name: "Jardinia Pro", slug: "jardinia-pro", isActive: true },
    }),
    prisma.brand.upsert({
      where: { slug: "blooma" },
      update: {},
      create: { name: "Blooma", slug: "blooma", isActive: true },
    }),
    prisma.brand.upsert({
      where: { slug: "karcher" },
      update: {},
      create: { name: "Kärcher", slug: "karcher", isActive: true },
    }),
  ]);
  console.log(`✅ ${brands.length} marques créées`);

  // ========================
  // CATÉGORIES PARENTES
  // ========================
  const catPiscines = await prisma.category.upsert({
    where: { slug: "piscines" },
    update: {},
    create: {
      name: "Piscines",
      slug: "piscines",
      description: "Piscines hors-sol, enterrées et accessoires",
      image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=400",
      sortOrder: 1,
    },
  });

  const catMobilier = await prisma.category.upsert({
    where: { slug: "mobilier-jardin" },
    update: {},
    create: {
      name: "Mobilier de jardin",
      slug: "mobilier-jardin",
      description: "Tables, chaises, salons de jardin et plus",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      sortOrder: 2,
    },
  });

  const catBarbecues = await prisma.category.upsert({
    where: { slug: "barbecues" },
    update: {},
    create: {
      name: "Barbecues & Plancha",
      slug: "barbecues",
      description: "Barbecues à gaz, charbon, électriques et planchas",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
      sortOrder: 3,
    },
  });

  const catTondeuses = await prisma.category.upsert({
    where: { slug: "tondeuses-gazon" },
    update: {},
    create: {
      name: "Tondeuses & Gazon",
      slug: "tondeuses-gazon",
      description: "Tondeuses, débroussailleuses et entretien du gazon",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      sortOrder: 4,
    },
  });

  const catOutils = await prisma.category.upsert({
    where: { slug: "outils-jardin" },
    update: {},
    create: {
      name: "Outils de jardin",
      slug: "outils-jardin",
      description: "Tous les outils pour entretenir votre jardin",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      sortOrder: 5,
    },
  });

  const catDecoration = await prisma.category.upsert({
    where: { slug: "decoration-exterieure" },
    update: {},
    create: {
      name: "Décoration extérieure",
      slug: "decoration-exterieure",
      description: "Éclairage, déco et accessoires pour votre extérieur",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400",
      sortOrder: 6,
    },
  });

  // ========================
  // SOUS-CATÉGORIES
  // ========================
  const catEntretienPiscine = await prisma.category.upsert({
    where: { slug: "entretien-piscine" },
    update: {},
    create: {
      name: "Entretien piscine",
      slug: "entretien-piscine",
      description: "Produits chimiques, filtration et nettoyage",
      parentId: catPiscines.id,
      sortOrder: 1,
    },
  });

  const catTablesJardin = await prisma.category.upsert({
    where: { slug: "tables-jardin" },
    update: {},
    create: {
      name: "Tables de jardin",
      slug: "tables-jardin",
      description: "Tables en bois, métal, résine et composite",
      parentId: catMobilier.id,
      sortOrder: 1,
    },
  });

  const catChaises = await prisma.category.upsert({
    where: { slug: "chaises-bancs" },
    update: {},
    create: {
      name: "Chaises & Bancs",
      slug: "chaises-bancs",
      description: "Chaises longues, fauteuils et bancs d'extérieur",
      parentId: catMobilier.id,
      sortOrder: 2,
    },
  });

  const catParasols = await prisma.category.upsert({
    where: { slug: "parasols" },
    update: {},
    create: {
      name: "Parasols & Tonnelles",
      slug: "parasols",
      description: "Parasols déportés, droits et tonnelles",
      parentId: catMobilier.id,
      sortOrder: 3,
    },
  });

  const catEclairage = await prisma.category.upsert({
    where: { slug: "eclairage-exterieur" },
    update: {},
    create: {
      name: "Éclairage extérieur",
      slug: "eclairage-exterieur",
      description: "Spots, guirlandes LED et lampes solaires",
      parentId: catDecoration.id,
      sortOrder: 1,
    },
  });

  console.log("✅ Catégories créées");

  // ========================
  // PRODUITS
  // ========================
  const brandIntex = brands.find((b) => b.slug === "intex")!;
  const brandBestway = brands.find((b) => b.slug === "bestway")!;
  const brandWeber = brands.find((b) => b.slug === "weber")!;
  const brandBosch = brands.find((b) => b.slug === "bosch")!;
  const brandHusqvarna = brands.find((b) => b.slug === "husqvarna")!;
  const brandJardinia = brands.find((b) => b.slug === "jardinia-pro")!;
  const brandBlooma = brands.find((b) => b.slug === "blooma")!;
  const brandKarcher = brands.find((b) => b.slug === "karcher")!;

  const products = [
    // ---- PISCINES ----
    {
      name: "Piscine hors-sol Intex Ultra XTR Frame 5,49m",
      slug: "piscine-hors-sol-intex-ultra-xtr-549m",
      sku: "INT-ULT-549",
      shortDescription: "Piscine rectangulaire ultra-résistante avec système de filtration",
      description: `<h3>La piscine familiale par excellence</h3>
<p>La piscine Intex Ultra XTR Frame est la référence des piscines hors-sol rectangulaires. Avec ses dimensions généreuses de 5,49 x 2,74 x 1,32 m, elle offre un espace de baignade exceptionnel pour toute la famille.</p>
<p>Sa structure en acier galvanisé traité anti-corrosion et ses parois tri-couches en PVC résistant garantissent une durabilité maximale saison après saison.</p>
<h4>Points forts :</h4>
<ul>
<li>Capacité : 15 390 litres</li>
<li>Structure en acier galvanisé renforcé</li>
<li>Système de filtration à cartouche 3 028 L/h inclus</li>
<li>Liner renforcé tri-couche 0,6 mm</li>
<li>Installation facile sans outil</li>
</ul>`,
      price: 649.99,
      compareAtPrice: 849.99,
      stock: 15,
      categoryId: catPiscines.id,
      brandId: brandIntex.id,
      isFeatured: true,
      isBestSeller: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Dimensions", value: "549 x 274 x 132 cm" },
        { name: "Capacité", value: "15 390 litres" },
        { name: "Matière", value: "Acier galvanisé + PVC tri-couche" },
        { name: "Filtration incluse", value: "Oui - 3 028 L/h" },
      ],
    },
    {
      name: "Piscine gonflable Intex Easy Set 3,66m",
      slug: "piscine-gonflable-intex-easy-set-366m",
      sku: "INT-ESY-366",
      shortDescription: "Piscine gonflable ronde idéale pour les petits jardins",
      description: `<h3>Simple, rapide et efficace</h3>
<p>La piscine Easy Set d'Intex s'installe en quelques minutes : il suffit de gonfler l'anneau supérieur et de remplir d'eau. Idéale pour les familles avec enfants.</p>
<p>Avec un diamètre de 3,66 m pour 91 cm de hauteur, elle offre un espace de jeux parfait tout l'été.</p>`,
      price: 149.99,
      compareAtPrice: 199.99,
      stock: 32,
      categoryId: catPiscines.id,
      brandId: brandIntex.id,
      isNew: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Diamètre", value: "366 cm" },
        { name: "Hauteur", value: "91 cm" },
        { name: "Capacité", value: "6 503 litres" },
        { name: "Type", value: "Gonflable" },
      ],
    },
    // ---- ENTRETIEN PISCINE ----
    {
      name: "Kit entretien piscine complet Bestway 7 pièces",
      slug: "kit-entretien-piscine-bestway-7-pieces",
      sku: "BES-ENT-7PC",
      shortDescription: "Tout ce qu'il faut pour maintenir votre piscine impeccable",
      description: `<h3>Le kit indispensable pour l'entretien de votre piscine</h3>
<p>Ce kit complet Bestway inclut tout le nécessaire pour garder votre piscine propre et transparente tout l'été.</p>
<p>Contenu : épuisette à feuilles, brosse de fond, aspirateur manuel, tuyau 3m, balai télescopique, thermomètre flottant et testeur d'eau.</p>`,
      price: 39.99,
      compareAtPrice: 59.99,
      stock: 45,
      categoryId: catEntretienPiscine.id,
      brandId: brandBestway.id,
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1562184552-997c461abbe6?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Contenu", value: "7 pièces" },
        { name: "Longueur manche", value: "3 m télescopique" },
        { name: "Compatibilité", value: "Toutes piscines" },
      ],
    },
    {
      name: "Robot nettoyeur de fond piscine Jardinia Pro",
      slug: "robot-nettoyeur-fond-piscine-jardinia-pro",
      sku: "JAR-ROB-001",
      shortDescription: "Robot automatique pour un fond de piscine toujours propre",
      description: `<h3>Nettoyage automatique et efficace</h3>
<p>Le robot de fond Jardinia Pro nettoie automatiquement le fond et les parois de votre piscine. Connecté via câble 12m, il aspire les débris, feuilles et impuretés sans effort de votre part.</p>`,
      price: 189.99,
      stock: 22,
      categoryId: catEntretienPiscine.id,
      brandId: brandJardinia.id,
      isNew: true,
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Câble", value: "12 mètres" },
        { name: "Surface max", value: "80 m²" },
        { name: "Filtration", value: "50 microns" },
        { name: "Alimentation", value: "220V" },
      ],
    },
    // ---- MOBILIER DE JARDIN ----
    {
      name: "Salon de jardin résine tressée 6 places Blooma",
      slug: "salon-jardin-resine-tressee-6-places-blooma",
      sku: "BLO-SAL-6PL",
      shortDescription: "Salon complet table + 4 fauteuils + canapé 2 places",
      description: `<h3>Le salon de jardin qui fait l'unanimité</h3>
<p>Ce magnifique salon en résine tressée grise avec coussins anthracite s'adapte à tous les styles d'extérieur. La résine tressée est résistante aux UV, à la pluie et au gel.</p>
<p>Ensemble complet : 1 table basse + 2 fauteuils + 1 canapé 3 places + coussins épais déhoussables.</p>`,
      price: 799.99,
      compareAtPrice: 1099.99,
      stock: 8,
      categoryId: catMobilier.id,
      brandId: brandBlooma.id,
      isFeatured: true,
      isBestSeller: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Matière", value: "Résine tressée + aluminium" },
        { name: "Places", value: "6 personnes" },
        { name: "Couleur", value: "Gris anthracite" },
        { name: "Coussins", value: "Inclus et déhoussables" },
        { name: "Résistance UV", value: "Oui" },
      ],
    },
    {
      name: "Table de jardin extensible aluminium 6/10 places",
      slug: "table-jardin-extensible-aluminium-6-10-places",
      sku: "JAR-TAB-EXT",
      shortDescription: "Table extensible de 160 à 240 cm en aluminium brossé",
      description: `<h3>La table qui s'adapte à vos invités</h3>
<p>Cette table extensible en aluminium brossé s'étend de 160 à 240 cm pour accueillir de 6 à 10 convives. Légère, résistante et facile à nettoyer, elle est le centrepiece idéal de votre terrasse.</p>`,
      price: 459.99,
      compareAtPrice: 599.99,
      stock: 12,
      categoryId: catTablesJardin.id,
      brandId: brandJardinia.id,
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Matière", value: "Aluminium brossé" },
        { name: "Dimensions repliée", value: "160 x 90 x 74 cm" },
        { name: "Dimensions dépliée", value: "240 x 90 x 74 cm" },
        { name: "Poids", value: "18 kg" },
        { name: "Places", value: "6 à 10 personnes" },
      ],
    },
    {
      name: "Lot 4 chaises de jardin empilables polypropylène",
      slug: "lot-4-chaises-jardin-empilables-polypropylene",
      sku: "JAR-CHI-4PL",
      shortDescription: "4 chaises légères, empilables et résistantes aux intempéries",
      description: `<h3>Pratiques et stylées</h3>
<p>Ce lot de 4 chaises en polypropylène renforcé offre confort et facilité de rangement. Empilables jusqu'à 8, elles se rangent sans encombrer. Disponibles en 4 coloris.</p>`,
      price: 79.99,
      compareAtPrice: 109.99,
      stock: 28,
      categoryId: catChaises.id,
      brandId: brandJardinia.id,
      isBestSeller: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Matière", value: "Polypropylène recyclable" },
        { name: "Dimensions", value: "55 x 46 x 82 cm" },
        { name: "Poids max", value: "120 kg / chaise" },
        { name: "Empilables", value: "Oui, jusqu'à 8" },
      ],
    },
    {
      name: "Parasol déporté 3m Blooma avec pied à vis",
      slug: "parasol-deporte-3m-blooma-pied-vis",
      sku: "BLO-PAR-3M",
      shortDescription: "Parasol déporté avec mât en aluminium et toile résistante UV",
      description: `<h3>L'ombre parfaite pour votre terrasse</h3>
<p>Ce parasol déporté de 3 mètres de diamètre offre une protection solaire optimale. Son pied à vis assuré dans le sol garantit une stabilité maximale même par vent modéré.</p>
<p>La toile en polyester 180 g/m² traité anti-UV bloque 95% des rayons UV.</p>`,
      price: 259.99,
      compareAtPrice: 349.99,
      stock: 18,
      categoryId: catParasols.id,
      brandId: brandBlooma.id,
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Diamètre", value: "300 cm" },
        { name: "Mât", value: "Aluminium Ø 48 mm" },
        { name: "Toile", value: "Polyester 180 g/m² anti-UV" },
        { name: "Hauteur", value: "260 cm" },
        { name: "Protection UV", value: "UPF 50+" },
      ],
    },
    // ---- BARBECUES ----
    {
      name: "Barbecue à gaz Weber Spirit E-315 3 brûleurs",
      slug: "barbecue-gaz-weber-spirit-e315-3-bruleurs",
      sku: "WEB-SPR-315",
      shortDescription: "Le barbecue à gaz compact et performant de Weber",
      description: `<h3>L'art du barbecue selon Weber</h3>
<p>Le Weber Spirit E-315 est le barbecue à gaz idéal pour les terrasses et balcons. Ses 3 brûleurs en inox développent 30 000 BTU pour une cuisson homogène et précise.</p>
<p>La grille de cuisson en fonte émaillée retient la chaleur et crée les fameuses marques de grillades.</p>`,
      price: 549.99,
      compareAtPrice: 699.99,
      stock: 10,
      categoryId: catBarbecues.id,
      brandId: brandWeber.id,
      isFeatured: true,
      isBestSeller: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Brûleurs", value: "3 brûleurs inox" },
        { name: "Puissance totale", value: "30 000 BTU" },
        { name: "Surface de cuisson", value: "7 650 cm²" },
        { name: "Combustible", value: "Gaz propane/butane" },
        { name: "Garantie", value: "10 ans (corps)" },
      ],
    },
    {
      name: "Barbecue charbon Jardinia Pro Classic Ø 57cm",
      slug: "barbecue-charbon-jardinia-pro-classic-57cm",
      sku: "JAR-BBQ-57",
      shortDescription: "Le barbecue charbon à cuve ronde indémodable",
      description: `<h3>Le goût authentique du charbon</h3>
<p>Rien ne remplace le goût d'un barbecue au charbon de bois. Ce modèle classique à cuve de 57 cm offre une grande surface de cuisson et une ventilation réglable pour maîtriser la température.</p>`,
      price: 89.99,
      compareAtPrice: 119.99,
      stock: 25,
      categoryId: catBarbecues.id,
      brandId: brandJardinia.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Diamètre cuve", value: "57 cm" },
        { name: "Hauteur totale", value: "95 cm" },
        { name: "Grille", value: "Acier chromé Ø 57 cm" },
        { name: "Cendrier", value: "Amovible" },
        { name: "Poids", value: "8 kg" },
      ],
    },
    // ---- TONDEUSES ----
    {
      name: "Tondeuse thermique Husqvarna LC 353V 53cm",
      slug: "tondeuse-thermique-husqvarna-lc353v-53cm",
      sku: "HUS-LC353V",
      shortDescription: "Tondeuse thermique autopropulsée pour grandes surfaces",
      description: `<h3>La puissance suédoise pour votre pelouse</h3>
<p>La Husqvarna LC 353V est une tondeuse thermique autopropulsée idéale pour les pelouses de 800 à 2500 m². Son moteur Husqvarna 163cc offre une puissance de coupe incomparable.</p>
<p>Largeur de coupe 53 cm, hauteur réglable en 6 positions de 25 à 75 mm, bac collecteur 70 litres.</p>`,
      price: 449.99,
      compareAtPrice: 549.99,
      stock: 9,
      categoryId: catTondeuses.id,
      brandId: brandHusqvarna.id,
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Moteur", value: "Husqvarna 163cc" },
        { name: "Largeur de coupe", value: "53 cm" },
        { name: "Bac collecteur", value: "70 litres" },
        { name: "Hauteur de coupe", value: "25-75 mm (6 positions)" },
        { name: "Autopropulsée", value: "Oui" },
        { name: "Surface recommandée", value: "800-2500 m²" },
      ],
    },
    {
      name: "Tondeuse robot Bosch Indego S+ 500",
      slug: "tondeuse-robot-bosch-indego-s-500",
      sku: "BOS-IND-S500",
      shortDescription: "Robot tondeuse connecté pour surfaces jusqu'à 500 m²",
      description: `<h3>Votre pelouse tondue automatiquement</h3>
<p>Le Bosch Indego S+ 500 tond votre pelouse de façon autonome en lignes droites précises (technologie Logicut). Connecté via l'appli Bosch Smart Gardening, programmez-le depuis votre smartphone.</p>`,
      price: 699.99,
      compareAtPrice: 899.99,
      stock: 14,
      categoryId: catTondeuses.id,
      brandId: brandBosch.id,
      isFeatured: true,
      isNew: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1614073143392-bf8a28f5ceee?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Surface max", value: "500 m²" },
        { name: "Largeur de coupe", value: "19 cm" },
        { name: "Hauteur de coupe", value: "20-50 mm" },
        { name: "Connectivité", value: "Wi-Fi + Appli Bosch" },
        { name: "Capteur pluie", value: "Oui" },
        { name: "Autonomie batterie", value: "70 min" },
      ],
    },
    // ---- OUTILS ----
    {
      name: "Set 5 outils de jardin inox Jardinia Pro",
      slug: "set-5-outils-jardin-inox-jardinia-pro",
      sku: "JAR-OUT-5PC",
      shortDescription: "Bêche, fourche, râteau, serfouette et plantoir en inox",
      description: `<h3>Les outils du jardinier sérieux</h3>
<p>Ce set complet de 5 outils en acier inoxydable poli est conçu pour durer. Les manches en frêne verni offrent une prise en main optimale et résistent aux intempéries.</p>`,
      price: 129.99,
      compareAtPrice: 179.99,
      stock: 30,
      categoryId: catOutils.id,
      brandId: brandJardinia.id,
      isBestSeller: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Matière tête", value: "Acier inoxydable" },
        { name: "Manche", value: "Frêne verni" },
        { name: "Contenu", value: "Bêche, fourche, râteau, serfouette, plantoir" },
      ],
    },
    {
      name: "Nettoyeur haute pression Kärcher K5 Premium",
      slug: "nettoyeur-haute-pression-karcher-k5-premium",
      sku: "KAR-K5-PRE",
      shortDescription: "Nettoyeur HP 145 bars pour terrasses et allées",
      description: `<h3>La propreté Kärcher</h3>
<p>Le Kärcher K5 Premium est le nettoyeur haute pression idéal pour les travaux de nettoyage extérieur intensifs. Avec 145 bars de pression et un débit de 500 L/h, il vient à bout des terrasses, allées et véhicules.</p>`,
      price: 349.99,
      compareAtPrice: 449.99,
      stock: 11,
      categoryId: catOutils.id,
      brandId: brandKarcher.id,
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Pression max", value: "145 bars" },
        { name: "Débit", value: "500 L/h" },
        { name: "Puissance moteur", value: "2 100 W" },
        { name: "Accessoires inclus", value: "Lance Vario, Surface Cleaner T-350" },
      ],
    },
    // ---- DÉCORATION ----
    {
      name: "Guirlande solaire LED 100 ampoules 12m",
      slug: "guirlande-solaire-led-100-ampoules-12m",
      sku: "JAR-GRL-SOL",
      shortDescription: "Guirlande lumineuse solaire pour créer l'ambiance",
      description: `<h3>Magie lumineuse sans fil ni prise</h3>
<p>Ces guirlandes solaires LED de 12 mètres avec 100 ampoules warm white créent une atmosphère féerique dans votre jardin ou sur votre terrasse. Panneau solaire amélioré, charge en 6h pour 8h d'éclairage.</p>`,
      price: 29.99,
      compareAtPrice: 44.99,
      stock: 55,
      categoryId: catEclairage.id,
      brandId: brandJardinia.id,
      isNew: true,
      isBestSeller: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Longueur", value: "12 mètres" },
        { name: "Nombre d'ampoules", value: "100 LED" },
        { name: "Couleur lumière", value: "Blanc chaud 3000K" },
        { name: "Alimentation", value: "Solaire" },
        { name: "Autonomie", value: "8 heures" },
        { name: "IP44", value: "Résistant aux intempéries" },
      ],
    },
    {
      name: "Spots solaires inox jardin lot de 8",
      slug: "spots-solaires-inox-jardin-lot-8",
      sku: "JAR-SPO-8PC",
      shortDescription: "8 spots LED solaires pour baliser allées et massifs",
      description: `<h3>Balisage automatique de votre jardin</h3>
<p>Ce lot de 8 spots solaires en inox brossé s'allume automatiquement à la tombée de la nuit. Idéaux pour baliser les allées, illuminer les massifs ou sécuriser les contours de terrasse.</p>`,
      price: 49.99,
      compareAtPrice: 69.99,
      stock: 40,
      categoryId: catEclairage.id,
      brandId: brandJardinia.id,
      isBestSeller: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Matière", value: "Inox brossé + verre trempé" },
        { name: "Quantité", value: "8 spots" },
        { name: "Allumage", value: "Automatique à la nuit" },
        { name: "IP", value: "IP65 - étanche" },
      ],
    },
    {
      name: "Parasol carré 3x3m avec LED intégrées Jardinia",
      slug: "parasol-carre-3x3m-led-jardinia",
      sku: "JAR-PAR-LED",
      shortDescription: "Parasol de terrasse avec éclairage LED intégré dans les baleines",
      description: `<h3>Profitez de l'extérieur jour et nuit</h3>
<p>Ce parasol de terrasse 3x3m intègre 48 LED dans ses baleines pour un éclairage d'ambiance unique. Batterie rechargeable USB, 3 modes d'éclairage, mât en aluminium anodisé.</p>`,
      price: 389.99,
      compareAtPrice: 499.99,
      stock: 7,
      categoryId: catParasols.id,
      brandId: brandJardinia.id,
      isFeatured: true,
      isNew: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Dimensions", value: "300 x 300 cm" },
        { name: "Éclairage", value: "48 LED intégrées" },
        { name: "Batterie", value: "Rechargeable USB 4 000 mAh" },
        { name: "Mât", value: "Aluminium anodisé Ø 48mm" },
        { name: "Toile", value: "Polyester 250 g/m² UPF50+" },
      ],
    },
    {
      name: "Chaise longue transat bois teck Jardinia Premium",
      slug: "chaise-longue-transat-bois-teck-jardinia",
      sku: "JAR-TRN-TKP",
      shortDescription: "Transat haut de gamme en teck massif avec coussin imperméable",
      description: `<h3>Le luxe du teck pour votre jardin</h3>
<p>Ce transat en teck massif FSC apporte une touche d'élégance naturelle à votre terrasse ou bord de piscine. Le teck est naturellement résistant aux intempéries et imputrescible.</p>
<p>Livré avec coussin épais 8 cm en tissu Sunbrella imperméable et déhoussable.</p>`,
      price: 349.99,
      compareAtPrice: 449.99,
      stock: 13,
      categoryId: catChaises.id,
      brandId: brandJardinia.id,
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Matière", value: "Teck massif FSC certifié" },
        { name: "Dimensions", value: "190 x 70 x 35 cm" },
        { name: "Poids", value: "14 kg" },
        { name: "Coussin", value: "Inclus - Sunbrella imperméable" },
        { name: "Positions", value: "5 positions" },
      ],
    },
    {
      name: "Engrais gazon universel granulés 10 kg Jardinia",
      slug: "engrais-gazon-universel-granules-10kg",
      sku: "JAR-ENG-10K",
      shortDescription: "Engrais complet NPK pour gazon vert et dense toute la saison",
      description: `<h3>Le gazon parfait commence par le bon engrais</h3>
<p>Cet engrais granulé à libération progressive nourrit votre gazon pendant 3 mois. Sa formulation NPK équilibrée (12-5-20) favorise la croissance des racines, la verdure intense et la résistance à la sécheresse.</p>`,
      price: 19.99,
      compareAtPrice: 28.99,
      stock: 80,
      categoryId: catTondeuses.id,
      brandId: brandJardinia.id,
      isBestSeller: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Poids", value: "10 kg" },
        { name: "NPK", value: "12-5-20" },
        { name: "Surface couverte", value: "jusqu'à 400 m²" },
        { name: "Action", value: "3 mois libération progressive" },
      ],
    },
    {
      name: "Seau à glaçons et bouteilles Jardinia Inox 15L",
      slug: "seau-glacons-bouteilles-jardinia-inox-15l",
      sku: "JAR-SEA-INX",
      shortDescription: "Grand seau champagne en inox pour apéros en plein air",
      description: `<h3>L'accessoire indispensable de vos soirées extérieur</h3>
<p>Ce grand seau en inox double paroi de 15L garde vos boissons fraîches pendant des heures. Sur son pied en bambou, il trône élégamment au milieu de votre terrasse lors de vos apéros estivaux.</p>`,
      price: 59.99,
      stock: 35,
      categoryId: catDecoration.id,
      brandId: brandJardinia.id,
      isNew: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Capacité", value: "15 litres" },
        { name: "Matière", value: "Inox double paroi + bambou" },
        { name: "Hauteur totale", value: "82 cm" },
      ],
    },
    {
      name: "Hamac à moustiquaire 2 places Jardinia Jungle",
      slug: "hamac-moustiquaire-2-places-jardinia-jungle",
      sku: "JAR-HAM-MOS",
      shortDescription: "Hamac double avec moustiquaire intégrée et sac de transport",
      description: `<h3>Siestez en paix</h3>
<p>Ce hamac 2 places en coton tissé avec moustiquaire intégrée vous protège des insectes tout en profitant de la nature. Charge max 200 kg, sac de transport inclus.</p>`,
      price: 89.99,
      compareAtPrice: 119.99,
      stock: 20,
      categoryId: catDecoration.id,
      brandId: brandJardinia.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
          isPrimary: true,
        },
      ],
      attributes: [
        { name: "Matière", value: "Coton tissé" },
        { name: "Charge max", value: "200 kg" },
        { name: "Dimensions déployé", value: "270 x 150 cm" },
        { name: "Moustiquaire", value: "Intégrée zipper" },
      ],
    },
  ];

  let productCount = 0;
  for (const productData of products) {
    const { images, attributes, compareAtPrice, ...rest } = productData;
    await prisma.product.upsert({
      where: { slug: rest.slug },
      update: {},
      create: {
        ...rest,
        price: rest.price,
        compareAtPrice: compareAtPrice ?? null,
        images: {
          create: images.map((img, i) => ({
            url: img.url,
            alt: rest.name,
            isPrimary: img.isPrimary,
            sortOrder: i,
          })),
        },
        attributes: {
          create: attributes,
        },
      },
    });
    productCount++;
  }
  console.log(`✅ ${productCount} produits créés`);

  // ========================
  // COUPONS
  // ========================
  await prisma.coupon.upsert({
    where: { code: "JARDINIA10" },
    update: {},
    create: {
      code: "JARDINIA10",
      type: "PERCENTAGE",
      value: 10,
      minOrderAmount: 50,
      isActive: true,
      usageLimit: 1000,
    },
  });
  await prisma.coupon.upsert({
    where: { code: "BIENVENUE20" },
    update: {},
    create: {
      code: "BIENVENUE20",
      type: "PERCENTAGE",
      value: 20,
      minOrderAmount: 100,
      isActive: true,
      usageLimit: 500,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  });
  await prisma.coupon.upsert({
    where: { code: "LIVRAISON" },
    update: {},
    create: {
      code: "LIVRAISON",
      type: "FREE_SHIPPING",
      value: 0,
      isActive: true,
    },
  });
  console.log("✅ Codes promo créés");

  // ========================
  // BANNIÈRES
  // ========================
  await prisma.banner.upsert({
    where: { id: "banner-1" },
    update: {},
    create: {
      id: "banner-1",
      title: "Préparez votre été 2025",
      subtitle: "Piscines, mobilier de jardin et barbecues",
      description: "Profitez de -20% sur une sélection d'articles",
      image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=1920",
      link: "/boutique",
      buttonText: "Découvrir les offres",
      sortOrder: 0,
    },
  });
  await prisma.banner.upsert({
    where: { id: "banner-2" },
    update: {},
    create: {
      id: "banner-2",
      title: "Livraison gratuite",
      subtitle: "Dès 79€ d'achats dans toute l'Europe",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920",
      link: "/boutique/mobilier-jardin",
      buttonText: "Explorer le mobilier",
      sortOrder: 1,
    },
  });
  console.log("✅ Bannières créées");

  console.log("\n🎉 Seed terminé avec succès !");
  console.log("📧 Admin : admin@jardinia-france.com");
  console.log("🔑 Mot de passe : Admin@Jardinia2024!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });