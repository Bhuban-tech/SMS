
import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  
  const hasToken = !!token;

  if (pathname === "/login" || pathname === "/register") {
    if (hasToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }


  const protectedPaths = ["/dashboard", "/contacts", "/sms-files"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));


  if (isProtected && !hasToken) {
    console.log("[Proxy] No token → redirect to /login");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); 
    return NextResponse.redirect(loginUrl);
  }


  if (pathname === "/" && hasToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

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
   
  ],
};