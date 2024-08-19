/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import type { Metadata } from "next";
import TypingAnimation from "@/components/magicui/typing-animation";
import ConfirmEmailForm from "@/components/forms/confirm-email";

export const metadata: Metadata = {
  title: "Verify your Email",
};

export default function ConfirmEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <TypingAnimation
            className="text-4xl font-bold text-black dark:text-white"
            text="Verify Your Email"
          />
          <p className="mt-2 text-center text-sm text-muted-foreground">
            We've sent a confirmation code to your email address. Enter the code
            below to verify your account.
          </p>
        </div>
        <ConfirmEmailForm />
      </div>
    </div>
  );
}
