import { NextResponse } from "next/server";

export async function middleware(request) {
  const cookies = request.cookies.getAll();

  const sessionCookie = cookies.find(
    (cookie) =>
      cookie.name === "better-auth.session_token" ||
      cookie.name === "__Secure-better-auth.session_token"
  );

  const { pathname } = request.nextUrl;

  if (
    !sessionCookie &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))
  ) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};