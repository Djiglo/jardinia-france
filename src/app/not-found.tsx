"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-black text-primary-100 mb-2 select-none">404</div>
        <h1 className="text-2xl font-bold text-anthracite-900 mb-2">Page introuvable</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Oops ! La page que vous recherchez n'existe pas ou a été déplacée.
          Pas de panique, votre jardin vous attend.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary flex items-center justify-center gap-2 px-6 py-3">
            <Home size={16} /> Accueil
          </Link>
          <Link href="/boutique" className="btn-outline flex items-center justify-center gap-2 px-6 py-3">
            <Search size={16} /> Explorer la boutique
          </Link>
        </div>
        <button
          onClick={() => history.back()}
          className="mt-4 flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mx-auto transition-colors"
        >
          <ArrowLeft size={14} /> Retour à la page précédente
        </button>
      </div>
    </div>
  );
}
