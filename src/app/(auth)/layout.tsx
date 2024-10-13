"use client";

import Image from "next/image";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Placeholder from "@/assets/svg/placeholder.svg";

const queryClient = new QueryClient();

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            {children}
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
          </div>
        </div>
        <div className="hidden bg-muted lg:block">
          <Image
            src={Placeholder}
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </QueryClientProvider>
  );
}
