import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const rows = await prisma.siteSettings.findMany();
  const settings: Record<string, string> = {};
  for (const row of rows) settings[row.key] = row.value;
  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const ALLOWED_KEYS = new Set([
    "siteName", "siteDescription", "contactEmail", "phoneNumber",
    "address", "freeShippingThreshold", "standardShippingCost",
    "expressShippingCost", "metaTitle", "metaDescription",
    "facebookUrl", "instagramUrl", "twitterUrl", "youtubeUrl",
    "maintenanceMode", "allowRegistrations", "analyticsId",
  ]);

  const body: Record<string, string> = await req.json();
  const allowed = Object.fromEntries(
    Object.entries(body).filter(([k]) => ALLOWED_KEYS.has(k))
  );

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ error: "Aucune clé valide" }, { status: 400 });
  }

  await Promise.all(
    Object.entries(allowed).map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        create: { key, value: String(value) },
        update: { value: String(value) },
      })
    )
  );

  return NextResponse.json({ success: true });
}
