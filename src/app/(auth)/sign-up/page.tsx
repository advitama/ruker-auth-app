// Import components from the Next.js
import Link from "next/link";
import type { Metadata } from "next";

// Import PostHogClient
import PostHogClient from "@/lib/posthog";

// Import RegisterForm from the forms
import RegisterForm from "@/lib/features/register/components/form/register";

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
  const googleAuthFlagEnabled = await posthog.isFeatureEnabled(
    "google-auth",
    "anonymous"
  );

  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
          <RegisterForm googleAuthFlagEnabled={googleAuthFlagEnabled} />
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="md:hidden mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
}
