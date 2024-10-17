"use client";

import { useRouter } from "next/navigation";
import {
  // useMutation,
  useQuery,
} from "@tanstack/react-query";
import AUTH_API from "@/lib/api/auth";
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
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, 
  // LoaderCircle
 } from "lucide-react";

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

// Define the expected response structure for verifying the reset token
interface VerifyResetTokenResponse {
  message: string; // Assuming the response contains a message field
}

export function ResetPasswordForm({ token }: { token: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const { toast } = useToast();

  const {
    // data,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["verify-reset-token", token],
    queryFn: async () => {
      await AUTH_API.get<VerifyResetTokenResponse>(
        `/verify-reset-token?token=${token}`
      )
        .then((response) => {
          return response.data;
        })
        .catch(() => {
          toast({
            title: "Token Verification Failed",
            description: "The reset token is invalid or has expired.",
          });
        });
    },
  });

  // const { mutateAsync, isPending, error } = useMutation({
  //   mutationFn: async ({
  //     id,
  //     key,
  //     password,
  //   }: {
  //     id: string;
  //     key: string;
  //     password: string;
  //   }) => {
  //     const response = await AUTH_API.post("/reset-password", {
  //       id,
  //       key,
  //       password,
  //     });
  //     return response.data;
  //   },
  //   onSuccess: () => {
  //     toast({
  //       title: "Password Reset",
  //       description: "Your password has been reset successfully.",
  //     });
  //     router.push("/login");
  //   },
  // });

  // Handle the loading state and the case when `data` is not yet available
  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or placeholder
  }

  // Handle error when fetching data
  if (queryError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{queryError.message}</AlertDescription>
      </Alert>
    );
  }

  // const credential = data?.message ? data.message.split(":") : null;

  // Ensure `credential` is defined before using it
  // if (!credential) {
  // return <div>Error: Invalid token</div>; // Handle invalid token case
  // }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // const [id, key] = credential;
    // await mutateAsync({
    //   id,
    //   key,
    //   password: values.password,
    // });
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
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
              {/* {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )} */}
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
                      least one letter, one number, and one special character.
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

              {/* <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                    Processing
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button> */}
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
