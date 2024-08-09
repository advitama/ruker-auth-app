"use client";

// Import components from the Next.js
import Link from "next/link";
import Image from "next/image";

// Import hooks from React
import { useState } from "react";

// Import components from the shadcn/ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
  password: z.string().min(8),
  remember: z.boolean().optional(),
});
/*
  * The LoginPage component is a form that allows users to login.
  * It uses the useForm hook to create a form, and the zodResolver to validate the form.
  * The onSubmit function is called when the form is submitted.
  * The onGoogleLogin function is called when the "Login with Google" button is clicked.
*/
export default function LoginPage() {
  // Use the useForm hook to create a form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Create a state to manage the loading
  const [loading, setLoading] = useState<boolean>(false);

  // Define the onSubmit function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    console.log(values);
    // if (error) {
    //   setLoading(false);
    //   form.setError("email", {
    //     type: "manual",
    //     message: error as string,
    //   });
    //   form.setError("password", {
    //     type: "manual",
    //     message: error as string,
    //   });
    // }
  };

  // Define the onGoogleLogin function
  const onGoogleLogin = async () => {
    setLoading(true);
  };

  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-xs text-balance text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
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
          {loading ? (
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
      {loading ? (
        <Button variant="outline" className="w-full" disabled>
          <LoaderCircle className="animate-spin" />
        </Button>
      ) : (
        <Button onClick={onGoogleLogin} variant="outline" className="w-full">
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
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="underline">
          Sign up
        </Link>
      </div>
    </>
  );
}
