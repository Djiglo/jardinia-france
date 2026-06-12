import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Nom requis" }, { status: 400 });
    }

    const slug = slugify(name.trim());

    const existing = await prisma.brand.findFirst({ where: { slug } });
    if (existing) {
      return NextResponse.json(existing);
    }

    const brand = await prisma.brand.create({
      data: { name: name.trim(), slug, isActive: true },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/admin/brands]", error);
    return NextResponse.json({ error: error.message ?? "Erreur" }, { status: 500 });
  }
}
