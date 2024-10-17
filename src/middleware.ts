import { env } from "./config/env";
import AUTH_API from "./lib/api/auth";
import type { Profile } from "@/types/profile";
import { NextRequest, NextResponse } from "next/server";

const routes = {
  protected: [`${env.NEXT_PUBLIC_BASE_PATH}/verify-email`],
  public: [
    `${env.NEXT_PUBLIC_BASE_PATH}/login`,
    `${env.NEXT_PUBLIC_BASE_PATH}/sign-up`,
    `${env.NEXT_PUBLIC_BASE_PATH}/forgot-password`,
    `${env.NEXT_PUBLIC_BASE_PATH}/reset-password`,
  ],
};

const isRouteProtected = (pathname: string) => routes.protected.includes(pathname);
const isRoutePublic = (pathname: string) => routes.public.includes(pathname);

async function fetchUserProfile(accessToken: string): Promise<Profile> {
  AUTH_API.defaults.headers.Authorization = `Bearer ${accessToken}`;
  return await AUTH_API.get("/user/profile");
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("access_token")?.value;

  if (!accessToken) {
    if (
      isRouteProtected(pathname) &&
      pathname !== `${env.NEXT_PUBLIC_BASE_PATH}/login`
    ) {
      return NextResponse.redirect(
        new URL(`${env.NEXT_PUBLIC_BASE_PATH}/login`, req.nextUrl)
      );
    }
    return NextResponse.next();
  }

  try {
    const response = await fetchUserProfile(accessToken);
    const isVerified = response.verified;

    if (!isVerified) {
      if (isRouteProtected(pathname) && pathname !== "/verify-email") {
        return NextResponse.redirect(new URL("/verify-email", req.nextUrl));
      }
      if (isRoutePublic(pathname) && pathname !== "/verify-email") {
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
    if (
      isRouteProtected(pathname) &&
      pathname !== `${env.NEXT_PUBLIC_BASE_PATH}/login`
    ) {
      return NextResponse.redirect(
        new URL(`${env.NEXT_PUBLIC_BASE_PATH}/login`, req.nextUrl)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
