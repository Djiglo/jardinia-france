import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Package, Heart, MapPin, User } from "lucide-react";
import SignOutButton from "@/components/layout/SignOutButton";

const navItems = [
  { href: "/compte",           label: "Tableau de bord", icon: User    },
  { href: "/compte/commandes", label: "Mes commandes",   icon: Package },
  { href: "/compte/favoris",   label: "Mes favoris",     icon: Heart   },
  { href: "/compte/adresses",  label: "Mes adresses",    icon: MapPin  },
];

export default async function CompteLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/connexion?callbackUrl=/compte");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <span className="text-primary-700 font-bold text-lg">
                  {session.user.name?.[0]?.toUpperCase() ?? "U"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-anthracite-800 truncate">{session.user.name}</p>
                <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                >
                  <Icon size={17} />
                  {label}
                </Link>
              ))}
              <SignOutButton className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors mt-2 pt-3 border-t border-gray-100 w-full text-left" />
            </nav>
          </div>
        </aside>

        {/* Contenu */}
        <div className="lg:col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
}
