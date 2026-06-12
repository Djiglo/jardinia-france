"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Minimize2, CheckCircle } from "lucide-react";

type Step = "idle" | "form" | "sending" | "sent";

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setMinimized(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setError("");
    setStep("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: "Chat en ligne",
          message: message.trim(),
        }),
      });

      if (res.ok) {
        setStep("sent");
      } else {
        setStep("form");
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } catch {
      setStep("form");
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setError("");
    setStep("form");
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open && !minimized && (
        <div
          className="w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 mb-3 flex flex-col overflow-hidden"
          style={{ maxHeight: 480 }}
        >
          {/* Header */}
          <div className="bg-primary-600 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">
                🌿
              </div>
              <div>
                <p className="font-semibold text-sm">Jardinia Support</p>
                <p className="text-xs text-primary-200">Nous répondons par e-mail</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setMinimized(true)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Réduire"
              >
                <Minimize2 size={16} />
              </button>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Corps */}
          {step === "sent" ? (
            <div className="flex flex-col items-center justify-center flex-1 p-6 text-center gap-3">
              <CheckCircle size={44} className="text-primary-500" />
              <p className="font-semibold text-anthracite-800">Message envoyé !</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Nous avons bien reçu votre message et vous répondrons à <strong>{email}</strong> dans les meilleurs délais.
              </p>
              <button
                onClick={handleReset}
                className="text-xs text-primary-600 hover:underline mt-2"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 p-4 gap-3 overflow-y-auto">
              <p className="text-sm text-gray-600 leading-relaxed">
                Bonjour 👋 Envoyez-nous un message, nous vous répondrons par e-mail rapidement !
              </p>

              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  required
                />
                <input
                  type="email"
                  placeholder="Votre e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  required
                />
                <textarea
                  placeholder="Votre message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 rounded-lg p-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={step === "sending"}
                className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                <Send size={15} />
                {step === "sending" ? "Envoi en cours..." : "Envoyer le message"}
              </button>
            </form>
          )}
        </div>
      )}

      <button
        onClick={open ? handleClose : handleOpen}
        className="w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-105 flex items-center justify-center"
        aria-label="Chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
