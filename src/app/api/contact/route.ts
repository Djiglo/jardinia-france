import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !message)
      return NextResponse.json({ error: "Champs requis" }, { status: 400 });
    if (typeof message !== "string" || message.length > 5000)
      return NextResponse.json({ error: "Message trop long (5000 caractères max)" }, { status: 400 });

    const sanitize = (s: string) => String(s).replace(/[\r\n]/g, " ").trim();
    const safeName    = sanitize(name);
    const safeEmail   = sanitize(email);
    const safeSubject = subject ? sanitize(subject) : "Sans sujet";

    // Sauvegarder en BDD (avec valeurs sanitisées)
    await prisma.contactMessage.create({
      data: { name: safeName, email: safeEmail, subject: safeSubject, message },
    });

    // Notifier l'admin
    if (process.env.SMTP_HOST && process.env.ADMIN_EMAIL) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: `"Jardinia Contact" <${process.env.SMTP_FROM}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `[Contact] ${safeSubject} — ${safeName}`,
        text: `De : ${safeName} <${safeEmail}>\n\nSujet : ${safeSubject}\n\n${message}`,
      }).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
