import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { token, email, password } = await req.json();

  if (!token || !email || !password) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Mot de passe trop court (8 caractères min)" }, { status: 400 });
  }
  if (password.length > 128) {
    return NextResponse.json({ error: "Mot de passe trop long (128 caractères max)" }, { status: 400 });
  }

  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token } },
  });

  if (!record || record.expires < new Date()) {
    return NextResponse.json({ error: "Lien invalide ou expiré" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 12);

  // Atomique : mise à jour mot de passe + suppression token en une seule transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { email: record.identifier },
      data: { password: hashed },
    }),
    prisma.verificationToken.delete({
      where: { identifier_token: { identifier: record.identifier, token } },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
