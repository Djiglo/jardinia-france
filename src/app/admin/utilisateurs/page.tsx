import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Search, ShieldCheck, ShieldOff, Mail } from "lucide-react";
import UserActions from "./UserActions";

interface Props {
  searchParams: Promise<{ page?: string; role?: string; search?: string }>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const { page = "1", role = "", search = "" } = await searchParams;
  const currentPage = parseInt(page);
  const perPage = 25;

  const where: any = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * perPage,
      take: perPage,
      include: {
        _count: { select: { orders: true, reviews: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  const roleBadge = (r: string) => {
    if (r === "SUPER_ADMIN") return <span className="badge bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">Super Admin</span>;
    if (r === "ADMIN") return <span className="badge bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">Admin</span>;
    return <span className="badge bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">Client</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={24} className="text-primary-600" />
          <h1 className="text-2xl font-bold text-anthracite-900">Utilisateurs</h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">{total}</span>
        </div>
      </div>

      {/* Filtres */}
      <form method="GET" className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            name="search"
            defaultValue={search}
            placeholder="Rechercher par nom ou email..."
            className="input pl-9 w-full text-sm"
          />
        </div>
        <select name="role" defaultValue={role} className="input text-sm w-40">
          <option value="">Tous les rôles</option>
          <option value="CUSTOMER">Client</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        <button type="submit" className="btn-primary text-sm px-4">Filtrer</button>
        {(search || role) && (
          <Link href="/admin/utilisateurs" className="btn-outline text-sm px-4">Réinitialiser</Link>
        )}
      </form>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Utilisateur</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Rôle</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Commandes</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Newsletter</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Inscrit le</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-xs flex-shrink-0">
                        {(user.name ?? user.email ?? "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-anthracite-800">{user.name ?? (`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "—")}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Mail size={11} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{roleBadge(user.role)}</td>
                  <td className="px-4 py-3 text-gray-700">{user._count.orders}</td>
                  <td className="px-4 py-3">
                    {user.newsletterSubscribed ? (
                      <ShieldCheck size={16} className="text-green-500" />
                    ) : (
                      <ShieldOff size={16} className="text-gray-300" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {user.isActive ? "Actif" : "Suspendu"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <UserActions userId={user.id} isActive={user.isActive} role={user.role} />
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-500">
            {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, total)} sur {total} utilisateurs
          </p>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/utilisateurs?page=${p}${role ? `&role=${role}` : ""}${search ? `&search=${search}` : ""}`}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  p === currentPage
                    ? "bg-primary-600 text-white border-primary-600"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
