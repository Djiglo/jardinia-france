import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, Package, Home } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-md">
      <div className="card p-10">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-anthracite-800 mb-3">
          Commande confirmée ! 🎉
        </h1>
        <p className="text-gray-500 mb-2">
          Merci pour votre achat. Un e-mail de confirmation vous a été envoyé.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Votre commande sera expédiée dans les meilleurs délais.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/compte/commandes" className="btn-primary flex items-center justify-center gap-2">
            <Package size={18} />
            Suivre ma commande
          </Link>
          <Link href="/" className="btn-outline flex items-center justify-center gap-2">
            <Home size={18} />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
