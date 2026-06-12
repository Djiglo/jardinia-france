import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  // Toujours répondre OK pour ne pas révéler si l'email existe
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600 * 1000); // 1 heure

    await prisma.verificationToken.upsert({
      where: { identifier_token: { identifier: email, token: "reset" } },
      update: { token, expires },
      create: { identifier: email, token, expires },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reinitialiser-mot-de-passe?token=${token}&email=${encodeURIComponent(email)}`;

    sendPasswordResetEmail({ to: email, resetLink }).catch(console.error);
  }

  return NextResponse.json({ ok: true });
}
