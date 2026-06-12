import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const { firstName, lastName, address1, address2, city, postalCode, country, phone } = body;

  if (!firstName || !lastName || !address1 || !city || !postalCode) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  // Whitelist des champs — jamais de spread direct vers Prisma
  const address = await prisma.address.create({
    data: {
      firstName,
      lastName,
      address1,
      address2: address2 ?? null,
      city,
      postalCode,
      country:  country ?? "FR",
      phone:    phone ?? null,
      userId:   session.user.id!,
    },
  });

  return NextResponse.json(address, { status: 201 });
}
