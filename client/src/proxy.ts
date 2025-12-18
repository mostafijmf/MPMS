import { NextResponse, NextRequest } from 'next/server';
import { IUser } from './types';
import { getUserProfile } from './fetch-api/user';
import { validateAuth } from './fetch-api/auth';
import { deleteCookieHandler } from './lib/cookie-handler';


const routeRoles: Record<string, string[]> = {
  "/dashboard/team": ["admin"],
  "/dashboard/projects": ["admin", "manager", "member"],
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");

  // Check user authentication
  if (!accessToken && !refreshToken)
    return NextResponse.redirect(new URL("/login", request.nextUrl));

  if (!accessToken && refreshToken) {
    const res = await validateAuth();
    if (!res.success) {
      await deleteCookieHandler(["accessToken", "refreshToken"]);
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }

  if (pathname === '/login' && refreshToken)
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));


  // Role-based route protection
  if (Object.keys(routeRoles).includes(pathname)) {
    const user: IUser = (await getUserProfile()).data?.data;
    const allowedRoles = routeRoles[pathname];

    if (!user || !allowedRoles.includes(user.role)) {
      await deleteCookieHandler(["accessToken", "refreshToken"]);
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
  ],
}