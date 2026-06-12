import { prisma } from "@/lib/prisma";
import { Settings } from "lucide-react";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const rows = await prisma.siteSettings.findMany();
  const settings: Record<string, string> = {};
  for (const row of rows) settings[row.key] = row.value;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Settings size={24} className="text-primary-600" />
        <h1 className="text-2xl font-bold text-anthracite-900">Paramètres</h1>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
