import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
    return null;
  }
  return session;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { position: "asc" } },
      attributes: true,
    },
  });
  if (!product) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const { images, attributes, ...data } = body;

  // Auto-slug si le nom change
  if (data.name && !data.slug) data.slug = slugify(data.name);

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      price: parseFloat(data.price),
      compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
      costPrice: data.costPrice ? parseFloat(data.costPrice) : null,
      stock: parseInt(data.stock),
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []),
      // Mettre à jour les images
      ...(images !== undefined && {
        images: {
          deleteMany: {},
          create: images.map((url: string, i: number) => ({
            url,
            sortOrder: i,
            isPrimary: i === 0,
          })),
        },
      }),
      // Mettre à jour les attributs
      ...(attributes !== undefined && {
        attributes: {
          deleteMany: {},
          create: attributes.filter((a: any) => a.name && a.value),
        },
      }),
    },
    include: { images: true, attributes: true, category: true },
  });

  return NextResponse.json(product);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
