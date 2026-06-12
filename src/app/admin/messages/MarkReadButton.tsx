"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MarkReadButton({ messageId }: { messageId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function markRead() {
    setLoading(true);
    await fetch(`/api/admin/messages/${messageId}/read`, { method: "PATCH" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={markRead}
      disabled={loading}
      className="text-xs text-gray-400 hover:text-primary-600 transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Marquer lu"}
    </button>
  );
}
