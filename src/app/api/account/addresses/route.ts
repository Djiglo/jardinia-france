import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const data = await req.json();
  const { firstName, lastName, address1, city, postalCode } = data;
  if (!firstName || !lastName || !address1 || !city || !postalCode) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  const address = await prisma.address.create({
    data: { ...data, userId: session.user.id! },
  });

  return NextResponse.json(address, { status: 201 });
}
