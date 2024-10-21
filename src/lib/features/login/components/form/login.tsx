"use client";

// next component
import Link from "next/link";
import Image from "next/image";

// hooks
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

// zod
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// icons
import GoogleIcon from "@/assets/svg/Google.svg";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";

// components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// function & api
import AUTH_API from "@/lib/api/auth";
import { createSession } from "@/utils/functions/session";

// env
import { env } from "@/config/env";

// types
import type { Authenticated } from "@/types/auth";

// schema
import { LoginFormSchema } from "@/lib/features/login/schema/login-form";

type LoginFormProps = {
  googleAuthFlagEnabled?: boolean;
};

export default function LoginForm({
  googleAuthFlagEnabled = false,
}: LoginFormProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      remember: false,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof LoginFormSchema>) => {
      const response: Authenticated = await AUTH_API.post("/login", values);
      await createSession(response.access_token, values.remember || false);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Login Successful",
        description:
          "You have successfully logged in to your account. Welcome back!",
      });
      router.push(env.NEXT_PUBLIC_DASHBOARD_APP_URL);
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
              We couldn&apos;t log you in. Please check your email and password.
            </p>
            <p className="text-red-500 font-semibold mt-2">{error.message}</p>
          </>
        ),
      });
    },
  });

  const onSubmit = (values: z.infer<typeof LoginFormSchema>) => mutateAsync(values);

  const onGoogleLogin = async () => {
    setIsGoogleLoading(true);
    // Implement Google login logic here
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
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Sign In with Email"
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
            onClick={onGoogleLogin}
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
                Sign In with Google
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
}
