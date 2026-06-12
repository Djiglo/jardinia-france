"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProductActions({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Supprimer "${productName}" ? Cette action est irréversible.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Produit supprimé");
        router.refresh();
      } else {
        toast.error("Erreur lors de la suppression");
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/admin/produits/${productId}`}
        className="p-1.5 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors inline-flex"
        title="Modifier"
      >
        <Edit size={15} />
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors inline-flex disabled:opacity-40"
        title="Supprimer"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
