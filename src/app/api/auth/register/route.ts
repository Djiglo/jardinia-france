import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Champs requis manquants" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: "Mot de passe trop court" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Un compte existe déjà avec cet e-mail" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: "USER" },
    });

    // E-mail de bienvenue (non bloquant)
    sendWelcomeEmail(email, name).catch(console.error);

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
