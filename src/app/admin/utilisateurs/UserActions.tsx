"use client";

import { useState } from "react";
import { MoreVertical, UserX, UserCheck, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  isActive: boolean;
  role: string;
}

export default function UserActions({ userId, isActive, role }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const patch = async (body: object) => {
    setLoading(true);
    setOpen(false);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      toast.success("Utilisateur mis à jour");
      router.refresh();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        aria-label="Actions"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[170px]">
            <button
              onClick={() => patch({ isActive: !isActive })}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-left"
            >
              {isActive ? (
                <><UserX size={14} className="text-red-500" /> Suspendre</>
              ) : (
                <><UserCheck size={14} className="text-green-500" /> Réactiver</>
              )}
            </button>
            {role !== "ADMIN" && (
              <button
                onClick={() => patch({ role: role === "MANAGER" ? "CUSTOMER" : "MANAGER" })}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-left"
              >
                <Shield size={14} className="text-orange-500" />
                {role === "MANAGER" ? "Rétrograder client" : "Promouvoir manager"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
