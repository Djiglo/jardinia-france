"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function MarkAllReadButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const markAll = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/messages/read-all", { method: "POST" });
    if (res.ok) { toast.success("Tous les messages marqués comme lus"); router.refresh(); }
    else toast.error("Erreur");
    setLoading(false);
  };

  return (
    <button
      onClick={markAll}
      disabled={loading}
      className="inline-flex items-center gap-2 text-sm bg-white border border-gray-200 text-gray-600 hover:text-green-700 hover:border-green-300 hover:bg-green-50 px-4 py-2 rounded-xl transition-colors shadow-sm disabled:opacity-40"
    >
      <CheckCircle size={15} />
      {loading ? "En cours..." : "Tout marquer comme lu"}
    </button>
  );
}
