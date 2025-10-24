import "./globals.css";
import { supabase } from "../../lib/supabaseClient";
import type { Metadata } from "next";
import { SupabaseProvider } from "../../lib/supabaseProvider";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple todo app with Supabase and Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className={`${GeistSans.className} bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}