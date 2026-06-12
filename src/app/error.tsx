"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-black text-red-100 mb-2 select-none">500</div>
        <h1 className="text-2xl font-bold text-anthracite-900 mb-2">Une erreur est survenue</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Quelque chose s'est mal passé de notre côté. Notre équipe a été informée et travaille à résoudre le problème.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-primary flex items-center justify-center gap-2 px-6 py-3"
          >
            <RefreshCw size={16} /> Réessayer
          </button>
          <Link href="/" className="btn-outline flex items-center justify-center gap-2 px-6 py-3">
            <Home size={16} /> Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
