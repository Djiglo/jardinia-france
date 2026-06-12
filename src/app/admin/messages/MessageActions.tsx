"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function MessageActions({ messageId, isRead }: { messageId: string; isRead: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const markRead = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/messages/${messageId}/read`, { method: "PATCH" });
    if (res.ok) { toast.success("Marqué comme lu"); router.refresh(); }
    else toast.error("Erreur");
    setLoading(false);
  };

  const deleteMsg = async () => {
    if (!confirm("Supprimer ce message ? Action irréversible.")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/messages/${messageId}`, { method: "DELETE" });
    if (res.ok) { toast.success("Message supprimé"); router.refresh(); }
    else toast.error("Erreur lors de la suppression");
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      {!isRead && (
        <button
          onClick={markRead}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors border border-gray-200 disabled:opacity-40"
        >
          <CheckCircle size={13} />
          Marquer lu
        </button>
      )}
      {isRead && (
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <CheckCircle size={12} /> Lu
        </span>
      )}
      <button
        onClick={deleteMsg}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors disabled:opacity-40"
        title="Supprimer"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
