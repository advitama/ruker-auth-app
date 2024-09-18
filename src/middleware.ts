import { env } from "./config/env";
import { User } from "@/types/auth";
import AUTH_API from "./lib/api/auth";
import { NextRequest, NextResponse } from "next/server";

const routes = {
  protected: ["/verify-email"],
  public: ["/login", "/sign-up", "/forgot-password"],
};

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtectedRoute = routes.protected.includes(pathname);
  const isPublicRoute = routes.public.includes(pathname);
  const accessToken = req.cookies.get("access_token")?.value;

  if (!accessToken) {
    if (isProtectedRoute && pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    return NextResponse.next();
  }

  AUTH_API.defaults.headers.Authorization = `Bearer ${accessToken}`;

  try {
    const response: User = await AUTH_API.get("/profile");
    const isVerified = response.verified;

    if (!isVerified) {
      if (isProtectedRoute && pathname !== "/verify-email") {
        return NextResponse.redirect(new URL("/verify-email", req.nextUrl));
      }
      if (isPublicRoute && pathname !== "/verify-email") {
        return NextResponse.redirect(new URL("/verify-email", req.nextUrl));
      }
    }

    if (isVerified && pathname !== "/verify-email") {
      return NextResponse.redirect(
        new URL(env.NEXT_PUBLIC_DASHBOARD_APP_URL, req.nextUrl)
      );
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    if (isProtectedRoute && pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
