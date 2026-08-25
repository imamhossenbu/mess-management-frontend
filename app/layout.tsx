// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/common/QueryProvider";
import { ToastProvider } from "@/components/common/ToastProvider";
import { AuthProvider } from "@/components/common/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mess Management System",
  description: "Complete mess management solution",
};

// sdjhsdhsdjhjhsdjh

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider />
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
