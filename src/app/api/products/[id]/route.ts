import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const { images, attributes, ...raw } = body;

    const updateData: Record<string, unknown> = {
      name:             raw.name,
      slug:             raw.slug || slugify(raw.name),
      sku:              raw.sku,
      shortDescription: raw.shortDescription || null,
      description:      raw.description,
      price:            parseFloat(raw.price),
      compareAtPrice:   raw.compareAtPrice ? parseFloat(raw.compareAtPrice) : null,
      costPrice:        raw.costPrice       ? parseFloat(raw.costPrice)      : null,
      stock:            parseInt(raw.stock) || 0,
      categoryId:       raw.categoryId,
      brandId:          raw.brandId || null,
      isActive:         Boolean(raw.isActive),
      isFeatured:       Boolean(raw.isFeatured),
      isNew:            Boolean(raw.isNew),
      isBestSeller:     Boolean(raw.isBestSeller),
      tags:             Array.isArray(raw.tags) ? raw.tags : (raw.tags ? raw.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []),
      metaTitle:        raw.metaTitle        || null,
      metaDescription:  raw.metaDescription  || null,
    };

    if (images !== undefined) {
      updateData.images = {
        deleteMany: {},
        create: (images as string[]).map((url, i) => ({
          url,
          sortOrder: i,
          isPrimary: i === 0,
        })),
      };
    }

    if (attributes !== undefined) {
      updateData.attributes = {
        deleteMany: {},
        create: (attributes as any[])
          .filter((a) => a.name && a.value)
          .map(({ name, value }: { name: string; value: string }) => ({ name, value })),
      };
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData as any,
      include: { images: true, attributes: true, category: true },
    });

    // Invalidate homepage and product pages so changes appear immediately
    revalidatePath("/");
    revalidatePath("/boutique");
    revalidatePath(`/boutique/produit/${product.slug}`);

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("[PUT /api/products/:id]", error);
    const msg = error?.meta?.target
      ? `Conflit : ${error.meta.target} déjà utilisé par un autre produit.`
      : (error?.message ?? "Erreur lors de la mise à jour");
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
    await prisma.product.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/boutique");
    if (product?.slug) revalidatePath(`/boutique/produit/${product.slug}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[DELETE /api/products/:id]", error);
    return NextResponse.json({ error: error.message ?? "Erreur suppression" }, { status: 500 });
  }
}
