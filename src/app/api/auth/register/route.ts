import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

function generateWelcomeCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "BIENV-";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Champs requis manquants" }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Adresse e-mail invalide" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: "Mot de passe trop court (8 caractères min.)" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Un compte existe déjà avec cet e-mail" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: "CUSTOMER" },
    });

    // Créer un coupon de bienvenue unique, usage unique, valable 30 jours
    let welcomeCode: string | null = null;
    try {
      let code = generateWelcomeCode();
      // Éviter les collisions (très improbables)
      const maxAttempts = 5;
      for (let i = 0; i < maxAttempts; i++) {
        const exists = await prisma.coupon.findUnique({ where: { code } });
        if (!exists) break;
        code = generateWelcomeCode();
      }
      await prisma.coupon.create({
        data: {
          code,
          type: "PERCENTAGE",
          value: 20,
          minOrderAmount: 100,
          isActive: true,
          usageLimit: 1,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      welcomeCode = code;
    } catch {
      // Non bloquant — l'inscription réussit même sans coupon
    }

    sendWelcomeEmail({ to: email, firstName: name, welcomeCode }).catch(console.error);

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
