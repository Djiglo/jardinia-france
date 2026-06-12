// ================================================
// JARDINIA FRANCE - Layout Racine (app/layout.tsx)
// ================================================
import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/Providers";
import "@/styles/globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Jardinia France - Tout pour profiter de votre extérieur",
    template: "%s | Jardinia France",
  },
  description:
    "Spécialiste des produits de jardin, piscines et mobilier extérieur. Livraison dans toute l'Europe. Piscines, barbecues, tondeuses, mobilier de jardin et décoration extérieure.",
  keywords: [
    "jardin",
    "piscine",
    "mobilier de jardin",
    "tondeuse",
    "gazon",
    "barbecue",
    "parasol",
    "table de jardin",
    "accessoires piscine",
    "entretien piscine",
    "Île-de-France",
    "Provence",
    "Côte d'Azur",
  ],
  authors: [{ name: "Jardinia France" }],
  creator: "Jardinia France",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Jardinia France",
    title: "Jardinia France - Tout pour profiter de votre extérieur",
    description:
      "Spécialiste des produits de jardin et d'extérieur. Livraison dans toute l'Europe.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jardinia France",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jardinia France",
    description: "Tout pour profiter de votre extérieur",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: { google: "ADD_REAL_GOOGLE_SEARCH_CONSOLE_CODE_HERE" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${playfair.variable}`}>
      <head>
        {/* Structured Data - Organisation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Jardinia France",
              url: process.env.NEXT_PUBLIC_APP_URL,
              logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
              description: "Spécialiste des produits de jardin et d'extérieur",
              foundingDate: "2024",
              areaServed: "EU",
              sameAs: [
                "https://www.facebook.com/jardiniafrance",
                "https://www.instagram.com/jardiniafrance",
              ],
            }),
          }}
        />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
                borderRadius: "12px",
                padding: "12px 16px",
              },
              success: {
                iconTheme: { primary: "#16a34a", secondary: "#fff" },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
