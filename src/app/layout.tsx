import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/supabase/db";
import { ThemeProvider } from "@/lib/provider/theme-provider";
import { DM_Sans } from "next/font/google";

import { Toaster } from "@/components/ui/sonner"
import { SocketProvider } from "@/lib/provider/socket-provider";

const geistSans = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arcane - Collaborative Workspace Platform",
  description: "A modern collaborative workspace platform for teams to create, share, and manage documents together in real-time.",
  keywords: ["collaboration", "workspace", "real-time", "documents", "team", "productivity"],
  authors: [{ name: "Arcane Team" }],
  creator: "Arcane",
  publisher: "Arcane",
  openGraph: {
    title: "Arcane - Collaborative Workspace Platform",
    description: "A modern collaborative workspace platform for teams to create, share, and manage documents together in real-time.",
    siteName: "Arcane",
    locale: "en_US",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} bg-background`}>


        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          >
            <SocketProvider>

            {children}
        <Toaster />
            </SocketProvider>

        </ThemeProvider>
      </body>
    </html>
  );
}
