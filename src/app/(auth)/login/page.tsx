// Import components from the Next.js
import Link from "next/link";
import type { Metadata } from "next";

// Import PostHogClient
import PostHogClient from "@/lib/posthog";

// Import LoginForm from the forms
import LoginForm from "@/lib/features/login/components/form/login";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

/*
 * This component is used to render the login page
 * It uses the LoginForm component to render the login form
 * It also checks if the google-auth feature flag is enabled
 */
export default async function LoginPage() {
  const posthog = PostHogClient();
  const googleAuthflagEnabled = await posthog.isFeatureEnabled(
    "google-auth",
    "anonymous"
  );

  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Login to your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password below to login
          </p>
          <LoginForm googleAuthFlagEnabled={googleAuthflagEnabled} />
        </div>
        <div className="md:hidden mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline">
            Sign up{" "}
          </Link>{" "}
        </div>
      </div>
    </>
  );
}
