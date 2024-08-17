import { cookies } from "next/headers";
import { AUTH_API } from "./lib/axios";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/verify-email"];
const publicRoutes = ["/login", "/sign-up", "/forgot-password"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const access_token = cookies().get("access_token")?.value;

  let is_verified = false;

  if (access_token) {
    try {
      const response = await AUTH_API.get("/profile", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      is_verified = response.data.verified;

      if (!is_verified && isProtectedRoute) {
        if (path !== "/verify-email") {
          return NextResponse.redirect(new URL("/verify-email", req.nextUrl));
        }
      } else if (isPublicRoute && path !== "/verify-email" && !is_verified) {
        return NextResponse.redirect(new URL("/verify-email", req.nextUrl));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (isProtectedRoute && path !== "/login") {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
      }
    }
  } else {
    if (isProtectedRoute && path !== "/login") {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  if (is_verified && path === "/verify-email") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
