import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MapPin } from "lucide-react";
import AddressManager from "./AddressManager";

export default async function AdressesPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-anthracite-900 mb-6 flex items-center gap-2">
        <MapPin size={20} /> Mes adresses
      </h1>
      <AddressManager addresses={addresses} />
    </div>
  );
}
