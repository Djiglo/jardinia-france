import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://jardinia-france.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Dates fixes pour les pages statiques — évite de signaler une MAJ à chaque build
  const SITE_LAUNCH = new Date("2024-06-01");
  const LEGAL_DATE  = new Date("2024-01-01");

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                          lastModified: SITE_LAUNCH,  changeFrequency: "daily",   priority: 1   },
    { url: `${BASE_URL}/boutique`,            lastModified: SITE_LAUNCH,  changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE_URL}/faq`,                 lastModified: LEGAL_DATE,   changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`,             lastModified: LEGAL_DATE,   changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/a-propos`,            lastModified: LEGAL_DATE,   changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/livraison`,           lastModified: LEGAL_DATE,   changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/cgv`,                 lastModified: LEGAL_DATE,   changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/mentions-legales`,    lastModified: LEGAL_DATE,   changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/confidentialite`,     lastModified: LEGAL_DATE,   changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/cookies`,             lastModified: LEGAL_DATE,   changeFrequency: "yearly",  priority: 0.3 },
  ];

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const productPages: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${BASE_URL}/boutique/produit/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${BASE_URL}/boutique/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticPages, ...productPages, ...categoryPages];
  } catch {
    return staticPages;
  }
}
