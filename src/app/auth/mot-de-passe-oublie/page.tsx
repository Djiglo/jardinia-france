"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.message ?? "Une erreur est survenue.");
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <Link
          href="/auth/connexion"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Retour à la connexion
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-anthracite-900 mb-2">E-mail envoyé !</h1>
            <p className="text-gray-500 mb-6">
              Si un compte existe avec l&apos;adresse <strong>{email}</strong>, vous recevrez un e-mail
              de réinitialisation dans quelques minutes.
            </p>
            <p className="text-sm text-gray-400">
              Vérifiez également vos spams.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-4">
                <Mail size={20} className="text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-anthracite-900 mb-2">Mot de passe oublié ?</h1>
              <p className="text-gray-500 text-sm">
                Entrez votre e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
