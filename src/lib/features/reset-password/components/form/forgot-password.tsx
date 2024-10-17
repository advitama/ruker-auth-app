"use client";

// Import hooks
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

// Import API
import AUTH_API from "@/lib/api/auth";

// Import components
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import icons
import { ArrowLeft } from "lucide-react";

// Define the schema for the form
const formSchema = z.object({
  email: z.string().email(),
});

/*
 * The ForgotPasswordForm component is a form that allows users to reset their password.
 * It uses the useForm hook to create a form, and the zodResolver to validate the form.
 * The onSubmit function is called when the form is submitted.
 */
export function ForgotPasswordForm() {
  // Use the useRouter hook to get the router object
  const router = useRouter();

  // Use the useState hook to create a state variable called isSent
  const [isSent, setIsSent] = useState(false);

  // Use the useForm hook to create a form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Use the useMutation hook to create a mutation
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (data: { email: string }) => {
      await AUTH_API.post("/reset-password/forgot", data);
    },
    onSuccess: () => {
      setIsSent(true);
    },
  });

  // Create a function called onSubmit that takes values as an argument
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutateAsync({ email: values.email });
  };

  // If isSent is true, return a Card component with a title and description
  if (isSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent a password reset link to your email address.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push("/login")} className="w-full">
            Return to Login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error?.message || "An error occurred."}
                  </AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="me@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      We&apos;ll send you a password reset link to this email
                      address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant="link"
          onClick={() => router.push("/login")}
          className="text-sm text-black"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
}
