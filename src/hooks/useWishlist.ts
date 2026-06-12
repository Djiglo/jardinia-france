"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export function useWishlist() {
  const { data: session } = useSession();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/account/wishlist")
      .then((r) => r.json())
      .then((data: string[]) => setIds(new Set(data)))
      .catch(() => {});
  }, [session?.user]);

  const toggle = useCallback(async (productId: string, productName?: string) => {
    if (!session?.user) {
      toast("Connectez-vous pour sauvegarder vos favoris", { icon: "❤️" });
      return;
    }

    const wasIn = ids.has(productId);
    setIds((prev) => {
      const next = new Set(prev);
      wasIn ? next.delete(productId) : next.add(productId);
      return next;
    });

    setLoading(true);
    try {
      await fetch("/api/account/wishlist", {
        method:  wasIn ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ productId }),
      });
      if (wasIn) {
        toast("Retiré des favoris", { icon: "🗑️" });
      } else {
        toast.success(productName ? `"${productName}" ajouté aux favoris` : "Ajouté aux favoris");
      }
    } catch {
      setIds((prev) => {
        const next = new Set(prev);
        wasIn ? next.add(productId) : next.delete(productId);
        return next;
      });
      toast.error("Erreur lors de la mise à jour des favoris");
    } finally {
      setLoading(false);
    }
  }, [session?.user, ids]);

  const isInWishlist = useCallback((productId: string) => ids.has(productId), [ids]);

  return { toggle, isInWishlist, loading };
}
