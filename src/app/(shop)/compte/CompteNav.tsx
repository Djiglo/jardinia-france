"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Heart, MapPin, User } from "lucide-react";
import SignOutButton from "@/components/layout/SignOutButton";

const navItems = [
  { href: "/compte",           label: "Tableau de bord", icon: User    },
  { href: "/compte/commandes", label: "Mes commandes",   icon: Package },
  { href: "/compte/favoris",   label: "Mes favoris",     icon: Heart   },
  { href: "/compte/adresses",  label: "Mes adresses",    icon: MapPin  },
];

export default function CompteNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/compte" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active
                ? "bg-primary-50 text-primary-700 font-medium"
                : "text-gray-600 hover:bg-primary-50 hover:text-primary-700"
            }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        );
      })}
      <SignOutButton className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors mt-2 pt-3 border-t border-gray-100 w-full text-left" />
    </nav>
  );
}
