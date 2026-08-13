// proxy.ts (or middleware.ts - but proxy.ts is correct for Next.js 16+)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/auth/google",
  "/auth/google/callback",
  "/auth/callback",
];

const protectedRoutes = [
  "/dashboard",
  "/users",
  "/meals",
  "/marketings",
  "/inventory",
  "/utility-bills",
  "/payments",
  "/shop-debts",
  "/monthly-summary",
  "/profile",
];

// ✅ Change function name from "middleware" to "proxy"
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  const token = request.cookies.get("accessToken")?.value;

  // If user has token and tries to access login/register/home → redirect to dashboard
  if (
    token &&
    (pathname === "/" || pathname === "/login" || pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user has no token and tries to access protected route → redirect to login
  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user has no token and tries to access home page → redirect to login
  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// ✅ Also update the config if needed - it stays the same
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/auth/:path*",
    "/dashboard/:path*",
    "/users/:path*",
    "/meals/:path*",
    "/marketings/:path*",
    "/inventory/:path*",
    "/utility-bills/:path*",
    "/payments/:path*",
    "/shop-debts/:path*",
    "/monthly-summary/:path*",
    "/profile/:path*",
  ],
};
