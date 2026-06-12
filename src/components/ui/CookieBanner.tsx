"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Check } from "lucide-react";

type Consent = { analytics: boolean; marketing: boolean };

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [consent, setConsent] = useState<Consent>({ analytics: true, marketing: true });

  useEffect(() => {
    const stored = localStorage.getItem("jardinia-cookies");
    if (!stored) setVisible(true);
  }, []);

  const save = (all: boolean | null = null) => {
    const c = all === true ? { analytics: true, marketing: true } : all === false ? { analytics: false, marketing: false } : consent;
    localStorage.setItem("jardinia-cookies", JSON.stringify(c));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 bg-white border-t border-gray-200 shadow-2xl">
      <div className="max-w-5xl mx-auto">
        {!showCustomize ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie size={24} className="text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-anthracite-800 text-sm">Nous utilisons des cookies</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu.{" "}
                  <Link href="/cookies" className="text-primary-600 hover:underline">En savoir plus</Link>
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0 flex-wrap">
              <button onClick={() => setShowCustomize(true)} className="btn-outline text-xs px-3 py-1.5">
                Personnaliser
              </button>
              <button onClick={() => save(false)} className="btn-ghost text-xs px-3 py-1.5 text-gray-500">
                Refuser
              </button>
              <button onClick={() => save(true)} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
                <Check size={14} /> Tout accepter
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-anthracite-800">Préférences cookies</h3>
              <button onClick={() => setShowCustomize(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-2">
              {[
                { key: "essential", label: "Essentiels", desc: "Nécessaires au fonctionnement du site.", locked: true },
                { key: "analytics", label: "Analytics", desc: "Pour mesurer le trafic et améliorer nos services." },
                { key: "marketing", label: "Marketing", desc: "Pour personnaliser les publicités." },
              ].map(({ key, label, desc, locked }) => (
                <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-anthracite-700">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  {locked ? (
                    <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">Requis</span>
                  ) : (
                    <div
                      onClick={() => setConsent(prev => ({ ...prev, [key]: !prev[key as keyof Consent] }))}
                      className={`w-10 h-5 rounded-full transition-colors cursor-pointer flex items-center px-0.5 ${
                        consent[key as keyof Consent] ? "bg-primary-600" : "bg-gray-300"
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${consent[key as keyof Consent] ? "translate-x-5" : "translate-x-0"}`} />
                    </div>
                  )}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => save()} className="btn-primary text-sm px-4 py-2 flex items-center gap-1">
                <Check size={14} /> Sauvegarder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
