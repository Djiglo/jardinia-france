import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://jardinia-france.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/compte/", "/checkout/", "/panier"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
