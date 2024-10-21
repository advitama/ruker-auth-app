"use client";

// import next components
import Image from "next/image";

// import hooks
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

// import from zod
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// icons
import GoogleIcon from "@/assets/svg/Google.svg";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";

// import components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// import function and api
import AUTH_API from "@/lib/api/auth";
import { createSession } from "@/utils/functions/session";

// import types
import type { Authenticated } from "@/types/auth";
import { RegisterFormSchema } from "@/lib/features/register/schema/register-form";

type RegisterFormProps = {
  googleAuthFlagEnabled?: boolean;
};

export default function RegisterForm({
  googleAuthFlagEnabled = false,
}: RegisterFormProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof RegisterFormSchema>) => {
      const response: Authenticated = await AUTH_API.post("/register", {
        first_name: values.firstName,
        last_name: values.lastName,
        username: values.username,
        email: values.email,
        password: values.password,
      });

      await createSession(response.access_token, false);
      return response;
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
      router.push("/verify-email");
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterFormSchema>) =>
    mutateAsync(values);

  const onGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    // Implement Google sign-up logic here
    setIsGoogleLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 text-left"
        >
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
                    placeholder="me@example.com"
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder=""
                    autoComplete="username"
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
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  Password must be at least 8 characters long and contain at
                  least one letter, one number and one special character.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Create an account"
            )}
          </Button>
        </form>
      </Form>
      {googleAuthFlagEnabled && (
        <>
          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div> */}
          <Button
            onClick={onGoogleSignUp}
            variant="outline"
            className="w-full"
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <>
                <Image
                  src={GoogleIcon}
                  alt="Google"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                Sign Up with Google
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
}
