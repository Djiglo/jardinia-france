import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "E-mail requis" }, { status: 400 });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return NextResponse.json({ error: "E-mail invalide" }, { status: 400 });

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ message: "Déjà inscrit" });

  try {
    await prisma.newsletterSubscriber.create({ data: { email } });
  } catch (err: any) {
    if (err?.code === "P2002") return NextResponse.json({ message: "Déjà inscrit" });
    throw err;
  }
  return NextResponse.json({ message: "Inscription réussie !" }, { status: 201 });
}
