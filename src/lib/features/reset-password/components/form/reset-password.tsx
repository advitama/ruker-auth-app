"use client";

// Import hooks
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

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

// import use toast hook
import { useToast } from "@/hooks/use-toast";

// Import icons
import { ArrowLeft, LoaderCircle } from "lucide-react";

// Define the schema for the form
const formSchema = z
  .object({
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/*
 * The ResetPasswordForm component is a form that allows users to reset their password.
 * It uses the useForm hook to create a form, and the zodResolver to validate the form.
 * The onSubmit function is called when the form is submitted.
 */
export function ResetPasswordForm({ token }: { token: string }) {
  // Use the useForm hook to create a form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Use the useRouter hook to get the router object
  const router = useRouter();

  const { toast } = useToast();

  // Use the useQuery hook to fetch
  const { data } = useQuery({
    queryKey: ["verify-reset-token", token],
    queryFn: () => {
      const response = AUTH_API.get(`/verify-reset-token?token=${token}`);
      return response;
    },
  });

  // Use the useMutation hook to create a mutation
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async ({
      id,
      key,
      password,
    }: {
      id: string;
      key: string;
      password: string;
    }) => {
      const response = await AUTH_API.post("/reset-password", {
        id,
        key,
        password,
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Password Reset",
        description: "Your password has been reset successfully.",
      });
      router.push("/login");
    },
  });

  // Get the credential from the data
  const credential = data as unknown as {
    message: string;
  };

  // Create a function called onSubmit that takes values as an argument
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const [id, key] = credential.message.split(":");
    await mutateAsync({
      id,
      key,
      password: values.password,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>
          Enter your new password below to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}
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

              <Button type="submit" className="w-full" disabled={false}>
                {isPending ? (
                  <>
                    <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                    Processing
                  </>
                ) : (
                  "Reset Password"
                )}
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
