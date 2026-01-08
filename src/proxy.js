// proxy.js
import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  const hasToken = !!token;

  // Debug logs (you can remove these in production)
  console.log("[Proxy] Path:", pathname);
  console.log("[Proxy] Token present:", hasToken);
  console.log(
    "[Proxy] All cookies:",
    request.cookies.getAll().map((cookie) => ({ name: cookie.name, value: cookie.value }))
  );

  // Prevent logged-in users from accessing login or register pages
  if (pathname === "/login" || pathname === "/register") {
    if (hasToken) {
      console.log("[Proxy] Already logged in → redirect to /dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // List of protected routes
  const protectedPaths = ["/dashboard", "/contacts", "/sms-files"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // If trying to access protected route without token → redirect to login
  if (isProtected && !hasToken) {
    console.log("[Proxy] No token → redirect to /login");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); // So we can redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  // Optional: If user is logged in and visits root "/", send them to dashboard
  if (pathname === "/" && hasToken) {
    console.log("[Proxy] Root access with token → redirect to /dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow everything else (public pages, assets, etc.)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard",
    "/contacts/:path*",
    "/sms-files/:path*",
    // Add protected API routes if needed, e.g.:
    // "/api/protected/:path*",
  ],
};