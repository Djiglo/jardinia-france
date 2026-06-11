"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; from: "user" | "bot"; time: string }[]>([
    {
      text: "Bonjour ! 👋 Bienvenue chez Jardinia France. Comment puis-je vous aider aujourd'hui ?",
      from: "bot",
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const send = () => {
    if (!message.trim()) return;
    const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { text: message, from: "user", time: now }]);
    setMessage("");
    // Réponse automatique (à connecter à un service externe)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Merci pour votre message ! Un conseiller va vous répondre dans les plus brefs délais. En attendant, vous pouvez consulter notre FAQ.",
          from: "bot",
          time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open && !minimized && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 mb-3 flex flex-col overflow-hidden" style={{ height: 420 }}>
          {/* Header */}
          <div className="bg-primary-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                🌿
              </div>
              <div>
                <p className="font-semibold text-sm">Jardinia Support</p>
                <p className="text-xs text-primary-200">En ligne</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setMinimized(true)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <Minimize2 size={16} />
              </button>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                  msg.from === "user"
                    ? "bg-primary-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-700 rounded-bl-sm"
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-0.5 ${msg.from === "user" ? "text-primary-200" : "text-gray-400"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Écrivez votre message..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <button
              onClick={send}
              disabled={!message.trim()}
              className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => { setOpen(!open); setMinimized(false); }}
        className="w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-105 flex items-center justify-center"
        aria-label="Chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
