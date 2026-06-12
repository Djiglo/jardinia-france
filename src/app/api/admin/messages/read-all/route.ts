import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { count } = await prisma.contactMessage.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });

  return NextResponse.json({ updated: count });
}
