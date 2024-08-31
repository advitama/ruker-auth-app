"use client";

// Import components from the Next.js
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Import hooks from React
import { useState } from "react";

// Import the axios instance
import AUTH_API from "@/lib/axios/auth";

// Import createSession from the hooks/session.ts
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Import types
import { Authenticated } from "@/types/auth";

// icon
import { LoaderCircle } from "lucide-react";

// Define the schema for the form
const formSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    confirmPassword: z
      .string()
      .min(8, { message: "Be at least 8 characters long" }),
    isAgreed: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/*
 * The RegisterForm component is a form that allows users to sign up.
 * It uses the useForm hook to create a form, and the zodResolver to validate the form.
 * The onSubmit function is called when the form is submitted.
 * The onGoogleSignUp function is called when the "Sign up with Google" button is clicked.
 * The RegisterForm component takes a googleAuthflagEnabled prop that determines if the "Sign up with Google" button is displayed.
 */
function RegisterForm({
  googleAuthflagEnabled,
}: {
  googleAuthflagEnabled: boolean | undefined;
}) {
  // Use the useForm hook to create a form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Use the useRouter hook to get the router
  const router = useRouter();

  // Create a state to manage the loading
  const [loading, setLoading] = useState<boolean>(false);

  // Create a mutation to handle the sign up
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      try {
        const response: Authenticated = await AUTH_API.post("/register", {
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          password: values.password,
        });

        await createSession(response.access_token, false).then(() => {
          router.push("/verify-email");
        });
      } catch (error) {
        throw new Error((error as any).response?.data?.message);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Account Creation Failed",
        description: (
          <>
            <p>
              We encountered an error while creating your account. Please try
              again later.
            </p>
            <p className="text-red-500 font-semibold mt-2">{error.message}</p>
          </>
        ),
      });
    },
    onSuccess: () => {
      toast({
        title: "Account Created Successfully",
        description: "Welcome aboard! Your account has been created 🎉",
      });
    },
  });

  // Define the onSubmit function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutateAsync(values).then(() => {
      router.push("/verify-email");
    });
  };

  // Define the onGoogleSignUp function
  const onGoogleSignUp = async () => {
    setLoading(true);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John"
                      autoComplete="given-name"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Doe"
                      autoComplete="family-name"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                    autoComplete="email"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    autoComplete="new-password"
                    required
                  />
                </FormControl>
                <FormDescription>
                  Password must be at least 8 characters long and contain at
                  least one letter, one number and one special character.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
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
          <FormField
            control={form.control}
            name="isAgreed"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    className="mr-1"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>
                  I agree to the{" "}
                  <Link href="#" className="text-primary">
                    terms of service
                  </Link>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-2 space-y-3">
            {isPending ? (
              <Button className="w-full" disabled>
                <LoaderCircle className="animate-spin" />
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Create an account
              </Button>
            )}
          </div>
        </form>
      </Form>
      {googleAuthflagEnabled && (
        <>
          {loading ? (
            <Button variant="outline" className="w-full" disabled>
              <LoaderCircle className="animate-spin" />
            </Button>
          ) : (
            <Button
              onClick={onGoogleSignUp}
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
              Sign up with Google
            </Button>
          )}
        </>
      )}
    </>
  );
}

export default RegisterForm;
