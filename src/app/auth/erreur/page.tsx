import Link from "next/link";
import { AlertTriangle } from "lucide-react";

const AUTH_ERRORS: Record<string, string> = {
  OAuthSignin: "Impossible de démarrer la connexion OAuth.",
  OAuthCallback: "Erreur lors du retour OAuth.",
  OAuthCreateAccount: "Impossible de créer le compte via OAuth.",
  EmailCreateAccount: "Impossible de créer le compte.",
  Callback: "Erreur lors du callback de connexion.",
  OAuthAccountNotLinked:
    "Cet e-mail est déjà utilisé avec une autre méthode de connexion.",
  EmailSignin: "L'envoi de l'e-mail de connexion a échoué.",
  CredentialsSignin: "Identifiants incorrects. Vérifiez votre e-mail et mot de passe.",
  SessionRequired: "Vous devez être connecté pour accéder à cette page.",
  Default: "Une erreur est survenue lors de la connexion.",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = AUTH_ERRORS[error ?? "Default"] ?? AUTH_ERRORS.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Erreur de connexion
        </h1>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex flex-col gap-3">
          <Link
            href="/auth/connexion"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Réessayer
          </Link>
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
