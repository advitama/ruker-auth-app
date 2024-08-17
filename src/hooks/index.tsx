"use server";

import "server-only";
import { cookies } from "next/headers";

export async function createSession(access_token: string) {
  cookies().set("access_token", access_token, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  return cookies().get("access_token");
}

export async function deleteSession() {
  cookies().set("access_token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
    sameSite: "lax",
  });
}