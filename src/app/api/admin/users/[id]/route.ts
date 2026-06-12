import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { isActive, role } = body;

  const data: any = {};
  if (typeof isActive === "boolean") data.isActive = isActive;
  if (role && ["CUSTOMER", "ADMIN"].includes(role)) data.role = role;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Aucune modification" }, { status: 400 });
  }

  const user = await prisma.user.update({ where: { id }, data });
  return NextResponse.json({ success: true, user });
}
