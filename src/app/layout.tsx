import { cn } from "@/utils";
import "@/assets/styles/index.css";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { PHProvider } from "./providers/posthog";
import { Inter as FontSans } from "next/font/google";

const PostHogPageView = dynamic(() => import("./views/posthog"), {
  ssr: false,
});

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Ruker",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <PHProvider>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <PostHogPageView />
          {children}
        </body>
      </PHProvider>
    </html>
  );
}
