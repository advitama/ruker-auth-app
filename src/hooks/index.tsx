"use server";

import "server-only";
import { cookies } from "next/headers";

export async function onSignUp(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  try {
    const response = await fetch("http://localhost:8080/register", {
      method: "POST",
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Email has already been taken");
    }
  } catch (error) {
    throw error;
  }
}

export async function onLogin(email: string, password: string) {
  try {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Invalid email or password");
    } else {
      const { access_token } = await response.json();
      await createSession(access_token);
    }
  } catch (error) {
    throw error;
  }
}

async function createSession(access_token: string) {
  cookies().set("access_token", access_token, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    sameSite: "lax",
    path: "/",
  });
}