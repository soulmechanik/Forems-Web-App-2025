// frontend/middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  console.log(`👀 [Gatekeeper] Someone is trying to access: ${pathname}`);

  // Public paths (no auth required)
  const publicPaths = [
    "/login",
    "/register",
    "/",
    "/onboard",
    "/_next",
    "/favicon.ico",
    "/api/auth",
  ];

  if (publicPaths.some(path => pathname === path || (path !== "/" && pathname.startsWith(path)))) {
    console.log(`🛣️ [Gatekeeper] ${pathname} is public → allow`);
    return NextResponse.next();
  }

  // Get session token
  const token = await getToken({ req, secret });

  if (!token) {
    console.log("🚨 [Gatekeeper] No session token → redirect /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("🎫 [Gatekeeper] Token found:", {
    id: token.id,
    lastActiveRole: token.lastActiveRole,
  });

  // Allow /auth/redirect to always pass (safe zone)
  if (pathname.startsWith("/auth/redirect")) {
    console.log("🟢 [Gatekeeper] /auth/redirect is safe → allow");
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const role = token.lastActiveRole;

    const redirectToAuth = () => NextResponse.redirect(new URL("/auth/redirect", req.url));

    switch (role) {
      case "landlord":
        if (!pathname.startsWith("/dashboard/landlord")) return redirectToAuth();
        break;
      case "tenant":
        if (!pathname.startsWith("/dashboard/tenant")) return redirectToAuth();
        break;
      case "propertyManager":
        if (!pathname.startsWith("/dashboard/manager")) return redirectToAuth();
        break;
      case "agent":
        if (!pathname.startsWith("/dashboard/agent")) return redirectToAuth();
        break;
      default:
        return redirectToAuth();
    }
  }

  // Everything else allowed
  console.log(`🎉 [Gatekeeper] Access granted to ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/redirect"],
};
