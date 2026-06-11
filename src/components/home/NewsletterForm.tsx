"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("Inscription réussie ! Code BIENVENUE20 envoyé par e-mail.");
        setEmail("");
      } else {
        toast.error("Une erreur est survenue.");
      }
    } catch {
      toast.error("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="votre@email.fr"
        className="input flex-1"
        required
      />
      <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap disabled:opacity-60">
        {loading ? "..." : "S'inscrire"}
      </button>
    </form>
  );
}