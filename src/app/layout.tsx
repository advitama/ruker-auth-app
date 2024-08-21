import "@/assets/styles/index.css";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PHProvider } from "./providers/posthog";
import { ThemeProvider } from "./providers/theme";


const PostHogPageView = dynamic(() => import("./views/posthog"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
        <body className={inter.className}>
          <PostHogPageView />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            storageKey="theme"
            disableTransitionOnChange
            enableSystem
          >
            {children}
          </ThemeProvider>
        </body>
      </PHProvider>
    </html>
  );
}
