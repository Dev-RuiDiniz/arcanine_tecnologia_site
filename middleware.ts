import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { getAdminRouteRequiredPermission, hasPermission, type AppRole } from "@/lib/auth/rbac";

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    if (isLoginRoute) {
      return NextResponse.next();
    }

    const loginUrl = new URL("/admin/login", origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute) {
    const userRole = token.role as AppRole | undefined;
    if (userRole && hasPermission(userRole, "dashboard:view")) {
      return NextResponse.redirect(new URL("/admin", origin));
    }
    return NextResponse.next();
  }

  const requiredPermission = getAdminRouteRequiredPermission(pathname);
  if (!requiredPermission) {
    return NextResponse.redirect(new URL("/admin", origin));
  }

  const userRole = token.role as AppRole | undefined;
  if (!userRole || !hasPermission(userRole, requiredPermission)) {
    const loginUrl = new URL("/admin/login", origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
