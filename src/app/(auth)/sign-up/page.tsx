// Import components from the Next.js
import Link from "next/link";
import type { Metadata } from "next";

// Import PostHogClient
import PostHogClient from "@/lib/posthog";

// Import RegisterForm from the forms
import RegisterForm from "@/components/forms/register";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Sign up for an account",
};

/*
 * The SignUpPage component is a form that allows users to sign up.
 * It uses the useForm hook to create a form, and the zodResolver to validate the form.
 * The onSubmit function is called when the form is submitted.
 * The onGoogleSignUp function is called when the "Sign up with Google" button is clicked.
 */
export default async function SignUpPage() {
  const posthog = PostHogClient();
  const googleAuthflagEnabled = await posthog.isFeatureEnabled(
    "google-auth",
    "user distinct id"
  );

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Sign up</h1>
        <p className="text-xs text-balance text-muted-foreground">
          Enter your information to create an account
        </p>
      </div>
      <RegisterForm googleAuthflagEnabled={googleAuthflagEnabled} />
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </div>
    </>
  );
}
