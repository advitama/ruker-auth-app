"use server";

import "server-only";
import { env } from "@/config/env";
import { cookies } from "next/headers";

export async function createSession(
  access_token: string,
  is_remember: boolean
) {
  cookies().set("access_token", access_token, {
    httpOnly: true,
    secure: true,
    expires: is_remember
      ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // Cookie expires in 7 days if "Remember me" is checked
      : undefined, // Session cookie if "Remember me" is not checked
    sameSite: "lax",
    path: "/", // Cookie is available across the entire site
    domain: env.NEXT_PUBLIC_BASE_DOMAIN, // Set the domain to the parent domain, allowing access across subdomains (example '.ruker.id')
  });
}

export async function getAccessToken() {
  return cookies().get("access_token")?.value;
}