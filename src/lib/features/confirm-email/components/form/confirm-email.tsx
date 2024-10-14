"use client";

// Import react hooks
import { useState, useEffect } from "react";

// Import the env object from the config/env
import { env } from "@/config/env";

// Import the axios instance
import AUTH_API from "@/lib/api/auth";

// Import the useRouter hook from the next/router
import { useRouter } from "next/navigation";

// Import hooks from the tanstack/react-query
import { useMutation, useQuery } from "@tanstack/react-query";

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

// Import components from the shadcn/ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// import use toast hook
import { useToast } from "@/hooks/use-toast";

// Icon
import { LoaderCircle } from "lucide-react";

// Import types
import { User } from "@/types/auth";

const formSchema = z.object({
  verification_number: z.string(),
});

function ConfirmEmailForm() {
  const { data, isFetched } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response: User = await AUTH_API.get("/user/profile");
      return response;
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: { id: string; verification_number: string }) => {
      await AUTH_API.post("confirm-email", data).catch((error) => {
        throw error.response.data;
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Email verified successfully",
      });
    },
    onError: (error) => {
      form.setError("verification_number", {
        message: error.message,
      });
      toast({
        title: "Failed to verify your email",
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutateAsync({
      id: data?.id || "",
      verification_number: values.verification_number,
    }).then(() => {
      router.push(env.NEXT_PUBLIC_DASHBOARD_APP_URL);
    });
  };

  // Countdown state for resend button
  const [countdown, setCountdown] = useState(0);
  const countdownTime = 60; // Countdown duration in seconds

  // Function to calculate remaining time
  const calculateRemainingTime = () => {
    const resendTime = localStorage.getItem("resendTime");
    if (resendTime) {
      const savedTime = parseInt(resendTime, 10);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeDiff = currentTime - savedTime;
      if (timeDiff < countdownTime) {
        return countdownTime - timeDiff; // Return remaining time
      }
    }
    return 0; // If time has passed, no countdown
  };

  useEffect(() => {
    const remainingTime = calculateRemainingTime();
    if (remainingTime > 0) {
      setCountdown(remainingTime);
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const onResendConfirmationEmail = async () => {
    if (countdown > 0) return;

    AUTH_API.get("/resend-confirmation-email")
      .then(() => {
        toast({
          title: "Resend Confirmation Email",
          description: "Confirmation email sent successfully",
        });
        const currentTime = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        localStorage.setItem("resendTime", currentTime.toString()); // Store the time in localStorage
        setCountdown(countdownTime); // Start countdown after resending
      })
      .catch((error) => {
        toast({
          title: "Failed to resend confirmation email",
          description: error.message,
        });
      });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <FormField
              control={form.control}
              name="verification_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-foreground">
                    Confirmation Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      required
                      className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                      placeholder="Enter confirmation code"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            {isPending ? (
              <Button
                className="flex w-full justify-center rounded-md bg-primary py-2 px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                disabled
              >
                <LoaderCircle className="animate-spin" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isFetched}
                className="flex w-full justify-center rounded-md bg-primary py-2 px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Verify Email
              </Button>
            )}
          </div>
        </form>
      </Form>
      <div className="text-center text-sm text-muted-foreground">
        Didn`&apos;`t receive the code?{" "}
        <button
          onClick={onResendConfirmationEmail}
          className="font-medium text-primary hover:underline"
          disabled={countdown > 0} // Disable button during countdown
        >
          {countdown > 0
            ? `Resend email in ${countdown}s`
            : "Resend confirmation email"}
        </button>
      </div>
    </>
  );
}

export default ConfirmEmailForm;