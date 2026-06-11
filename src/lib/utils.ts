// ================================================
// JARDINIA FRANCE - Utilitaires
// ================================================
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ========================
// Class merging (Tailwind)
// ========================
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ========================
// Formatage prix
// ========================
export function formatPrice(
  price: number,
  locale: string = "fr-FR",
  currency: string = "EUR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

// ========================
// Calcul remise
// ========================
export function getDiscountPercent(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

// ========================
// Slugification
// ========================
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ========================
// Génération numéro de commande
// ========================
export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, "0");
  return `JAR${year}${month}${day}-${random}`;
}

// ========================
// Calcul frais de livraison
// ========================
export function calculateShipping(
  subtotal: number,
  method: "standard" | "express" = "standard"
): number {
  if (method === "standard" && subtotal >= 79) return 0;
  if (method === "standard") return 5.99;
  return 12.99;
}

// ========================
// Formatage date
// ========================
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(new Date(date));
}

// ========================
// Tronquer texte
// ========================
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

// ========================
// Étoiles pour les notes
// ========================
export function getRatingStars(rating: number): {
  full: number;
  half: boolean;
  empty: number;
} {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
}

// ========================
// Status commande label FR
// ========================
export const orderStatusLabels: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PROCESSING: "En préparation",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
  REFUNDED: "Remboursée",
};

export const orderStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

// ========================
// Validation email
// ========================
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ========================
// Validation code postal FR
// ========================
export function isValidPostalCodeFR(code: string): boolean {
  return /^[0-9]{5}$/.test(code);
}
