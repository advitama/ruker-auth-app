/* eslint-disable react/no-unescaped-entities */
import TypingAnimation from "@/components/magicui/typing-animation";

import Link from "next/link";

export default function ConfirmEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          {/* <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Verify Your Email
          </h2> */}
          <TypingAnimation
            className="text-4xl font-bold text-black dark:text-white"
            text="Verify Your Email"
          />
          <p className="mt-2 text-center text-sm text-muted-foreground">
            We've sent a confirmation code to your email address. Enter the code
            below to verify your account.
          </p>
        </div>
        <form className="space-y-6" action="#" method="POST">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-foreground"
            >
              Confirmation Code
            </label>
            <div className="mt-1">
              <input
                id="code"
                name="code"
                type="text"
                autoComplete="off"
                required
                className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                placeholder="Enter confirmation code"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary py-2 px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Verify Email
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          <Link
            href="#"
            className="font-medium text-primary hover:underline"
            prefetch={false}
          >
            Resend confirmation email
          </Link>
        </div>
      </div>
    </div>
  );
}
