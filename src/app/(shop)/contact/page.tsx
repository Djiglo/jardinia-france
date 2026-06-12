"use client";

import { useState } from "react";
import { Mail, MapPin, Clock, Send, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        toast.success("Message envoyé !");
      } else {
        toast.error("Erreur lors de l'envoi");
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-anthracite-900 mb-3">Contactez-nous</h1>
        <p className="text-gray-500">Notre équipe vous répond dans les plus brefs délais</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Infos */}
        <div className="lg:col-span-2 space-y-5">
          {[
            { icon: Mail, title: "E-mail", value: "contact@jardinia-france.fr", href: "mailto:contact@jardinia-france.fr" },
            { icon: MapPin, title: "Localisation", value: "Île-de-France, France" },
            { icon: Clock, title: "Horaires", value: "Lun–Ven 9h–18h" },
          ].map(({ icon: Icon, title, value, href }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="p-2.5 bg-primary-50 rounded-xl flex-shrink-0">
                <Icon size={20} className="text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-anthracite-700 text-sm">{title}</p>
                {href ? (
                  <a href={href} className="text-gray-500 text-sm hover:text-primary-600">{value}</a>
                ) : (
                  <p className="text-gray-500 text-sm">{value}</p>
                )}
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-anthracite-700 mb-3">Suivez-nous</p>
            <div className="flex gap-3">
              {["Facebook", "Instagram", "Pinterest"].map((social) => (
                <a key={social} href="#" className="px-3 py-1.5 bg-gray-100 hover:bg-primary-50 hover:text-primary-600 rounded-lg text-xs font-medium text-gray-600 transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="lg:col-span-3">
          {sent ? (
            <div className="card p-10 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-anthracite-800 mb-2">Message envoyé !</h3>
              <p className="text-gray-500">Nous vous répondrons dans les 24 heures ouvrées.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input className="input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                  <input type="email" className="input" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet *</label>
                <select className="input" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} required>
                  <option value="">Choisir un sujet</option>
                  <option>Question sur un produit</option>
                  <option>Suivi de commande</option>
                  <option>Retour / remboursement</option>
                  <option>Partenariat</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  className="input min-h-[140px] resize-y"
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  required
                  placeholder="Comment pouvons-nous vous aider ?"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <><Send size={16} /> Envoyer le message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
