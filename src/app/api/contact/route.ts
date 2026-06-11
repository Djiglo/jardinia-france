export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !message)
      return NextResponse.json({ error: "Champs requis" }, { status: 400 });

    // Sauvegarder en BDD
    await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    // Notifier l'admin
    if (process.env.SMTP_HOST && process.env.ADMIN_EMAIL) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: `"Jardinia Contact" <${process.env.SMTP_FROM}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `[Contact] ${subject} — ${name}`,
        text: `De : ${name} <${email}>\n\nSujet : ${subject}\n\n${message}`,
      }).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}