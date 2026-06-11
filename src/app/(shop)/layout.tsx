// ================================================
// JARDINIA FRANCE - Layout Principal
// ================================================
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LiveChat } from "@/components/ui/LiveChat";
import { CookieBanner } from "@/components/ui/CookieBanner";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <LiveChat />
      <CookieBanner />
    </>
  );
}
