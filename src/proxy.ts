import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/"];
const PROTECTED_ROUTES: string[] = [];
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/expenses",
  "/categories",
  "/workers",
  "/reports",
  "/roles",
  "/analytics",
  "/settings",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🟢 Allow public routes (everyone can access)
  if (PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/api")) {
    const token = request.cookies.get("access_token")?.value;
    // If logged in and trying to go to login, send to dashboard
    if (pathname === "/" && token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Check if route starts with any of the protected prefixes
  const isProtected =
    PROTECTED_ROUTES.includes(pathname) ||
    PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // 🔒 Protected routes - require authentication
  if (isProtected) {
    const token = request.cookies.get("access_token")?.value || request.cookies.get("refresh_token")?.value;

    // ❌ Protected but no token → redirect to auth
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }



    // ✅ Protected with token → allow access
    return NextResponse.next();
  }

  // 🔴 Unknown route → redirect to custom not-found page
  return NextResponse.redirect(new URL("/not-found", request.url));
}

// Apply proxy to all routes except static files and API
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
