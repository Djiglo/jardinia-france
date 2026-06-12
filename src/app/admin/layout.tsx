import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, BarChart3, Settings, Leaf } from "lucide-react";
import SignOutButton from "@/components/layout/SignOutButton";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/promotions", label: "Promotions", icon: Tag },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-anthracite-900 text-white flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-anthracite-700">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
            <Leaf size={22} className="text-primary-400" />
            <span className="text-primary-300">Jardinia</span>
            <span className="text-xs bg-primary-600 px-2 py-0.5 rounded-full text-white">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-anthracite-700 hover:text-white transition-colors"
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-anthracite-700">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold">
              {session.user.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
              <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
            </div>
          </div>
          <SignOutButton className="flex items-center gap-2 text-sm text-gray-400 hover:text-white px-2 py-1.5 rounded transition-colors" />
        </div>
      </aside>

      {/* Contenu */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
