"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message ?? "Inscription réussie !");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Une erreur est survenue.");
      }
    } catch {
      setStatus("error");
      setMessage("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-2 p-4 bg-white/20 rounded-xl text-white font-medium max-w-md mx-auto">
        ✅ {message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === "loading"}
        placeholder="Votre adresse email"
        className="flex-1 px-4 py-3 rounded-xl text-anthracite-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-70"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-secondary shrink-0 font-semibold disabled:opacity-70"
      >
        {status === "loading" ? "Inscription…" : "S'inscrire"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-300 w-full text-center sm:col-span-2">{message}</p>
      )}
    </form>
  );
}
