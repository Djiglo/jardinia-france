import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth?.user;
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(req.auth?.user?.role as string);

  // Routes protégées compte client
  if (pathname.startsWith("/compte") && !isAuthenticated) {
    return NextResponse.redirect(
      new URL(`/auth/connexion?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
    );
  }

  // Routes admin
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(
        new URL(`/auth/connexion?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
      );
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Redirection si déjà connecté
  if ((pathname.startsWith("/auth/connexion") || pathname.startsWith("/auth/inscription")) && isAuthenticated) {
    return NextResponse.redirect(new URL("/compte", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/compte/:path*", "/admin/:path*", "/auth/connexion", "/auth/inscription"],
};
