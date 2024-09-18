"use server";

import "server-only";
import { cookies } from "next/headers";

export async function createSession(
  access_token: string,
  is_remember: boolean
) {
  cookies().set("access_token", access_token, {
    httpOnly: true,
    secure: true,
    expires: is_remember
      ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      : undefined,
    sameSite: "lax",
    path: "/",
  });
}

export async function getAccessToken() {
  return cookies().get("access_token")?.value;
}