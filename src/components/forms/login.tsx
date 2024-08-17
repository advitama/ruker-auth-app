"use client";

// Import components from the Next.js
import Link from "next/link";
import Image from "next/image";

// Import hooks from React
import { useState } from "react";

// Import the axios instance
import { AUTH_API } from "@/lib/axios";

// Import the createSession hook
import { createSession } from "@/hooks/session";

// Import components from the shadcn/ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

// Import hooks from the tanstack/react-query
import { useMutation } from "@tanstack/react-query";

// Import components from the shadcn/ui/form, zod, and react-hook-form
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// icon
import { LoaderCircle } from "lucide-react";

// Define the schema for the form
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Be at least 8 characters long" }),
  remember: z.boolean().optional(),
});

/*
 * The LoginForm component is a form that allows users to login.
 * It uses the useForm hook to create a form, and the zodResolver to validate the form.
 * The onSubmit function is called when the form is submitted.
 * The onGoogleLogin function is called when the "Login with Google" button is clicked.
 * The LoginForm component takes a googleAuthflagEnabled prop that determines if the "Login with Google" button is displayed.
 */
function LoginForm({
  googleAuthFlagEnabled,
}: {
  googleAuthFlagEnabled: boolean | undefined;
}) {
  // Use the useForm hook to create a form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Create a state to manage the loading
  const [loading, setLoading] = useState<boolean>(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (value: z.infer<typeof formSchema>) => {
      await AUTH_API.post("/login", value)
        .then((response) => {
          createSession(response.data.access_token);
        })
        .catch((error) => {
          throw new Error(error.response.data.message);
        });
    },
    onSuccess: () => {
      toast({
        title: "Login Successful",
        description:
          "You have successfully logged in to your account. Welcome back!",
      });
    },
    onError: (error: Error) => {
      form.setError("email", {
        type: "manual",
        message: "Invalid email or password",
      });
      form.setError("password", {
        type: "manual",
        message: "Invalid email or password",
      });
      toast({
        title: "Login Failed",
        description: (
          <>
            <p>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              We couldn't log you in. Please check your email and password.
            </p>
            <p className="text-red-500 font-semibold mt-2">
              {(error as Error).message}
            </p>
          </>
        ),
      });
    },
  });

  // Define the onSubmit function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutateAsync(values);
  };

  // Define the onGoogleLogin function
  const onGoogleLogin = async () => {
    setLoading(true);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="johndoe@example.com"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex">
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      className="mr-1"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Remember me</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link
              href="/forgot-password"
              className="ml-auto inline-block text-xs underline"
            >
              Forgot your password?
            </Link>
          </div>
          {isPending ? (
            <Button className="w-full" disabled>
              <LoaderCircle className="animate-spin" />
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Login
            </Button>
          )}
        </form>
      </Form>
      {googleAuthFlagEnabled && (
        <>
          {loading ? (
            <Button variant="outline" className="w-full" disabled>
              <LoaderCircle className="animate-spin" />
            </Button>
          ) : (
            <Button
              onClick={onGoogleLogin}
              variant="outline"
              className="w-full"
            >
              <Image
                src="/Google.svg"
                alt="Google"
                width={16}
                height={16}
                className="mr-2"
              />
              Login with Google
            </Button>
          )}
        </>
      )}
    </>
  );
}

export default LoginForm;
