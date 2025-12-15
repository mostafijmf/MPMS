import { NextResponse, NextRequest } from 'next/server';
import { IUser } from './types';
import { getUserProfile } from './fetch-api/user';
import { validateAuth } from './fetch-api/auth';
import { deleteCookieHandler } from './lib/cookie-handler';

const adminRoute = [
  "/dashboard/team",
]

export async function proxy(request: NextRequest) {
  const user: IUser = (await getUserProfile()).data?.data;
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");

  // Check user authentication
  if (!accessToken && !refreshToken)
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  else if (!accessToken && refreshToken) {
    const res = await validateAuth();
    if (!res.success)
      return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (pathname === '/login' && refreshToken)
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));

  // Redirect to login if user role isn't admin or manager
  // if (adminRoute.includes(pathname) && !(user?.role === "admin" || user?.role === "manager")) {
  //   await deleteCookieHandler(["accessToken", "refreshToken"])
  //   return NextResponse.redirect(new URL("/login", request.nextUrl));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
  ],
}