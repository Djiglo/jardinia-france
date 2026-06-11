export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "E-mail requis" }, { status: 400 });

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ message: "Déjà inscrit" });

  await prisma.newsletterSubscriber.create({ data: { email } });
  return NextResponse.json({ message: "Inscription réussie !" }, { status: 201 });
}