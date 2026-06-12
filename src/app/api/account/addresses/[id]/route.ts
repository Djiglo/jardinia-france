import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkOwnership(id: string, userId: string) {
  const addr = await prisma.address.findUnique({ where: { id } });
  return addr?.userId === userId ? addr : null;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { id } = await params;
  const addr = await checkOwnership(id, session.user.id!);
  if (!addr) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const data = await req.json();
  const updated = await prisma.address.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { id } = await params;
  const addr = await checkOwnership(id, session.user.id!);
  if (!addr) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  await prisma.address.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
