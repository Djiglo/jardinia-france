import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId requis" }, { status: 400 });

  const reviews = await prisma.review.findMany({
    where: { productId, status: "APPROVED" },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { productId, rating, title, comment } = await req.json();
  if (!productId || !rating || !comment)
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });

  // Vérifier que l'utilisateur n'a pas déjà laissé un avis
  const existing = await prisma.review.findFirst({
    where: { productId, userId: session.user.id },
  });
  if (existing)
    return NextResponse.json({ error: "Vous avez déjà laissé un avis pour ce produit" }, { status: 409 });

  const review = await prisma.review.create({
    data: {
      productId,
      userId: session.user.id,
      rating: Math.min(5, Math.max(1, rating)),
      title,
      comment,
      status: "PENDING", // modération
    },
  });

  return NextResponse.json(review, { status: 201 });
}
