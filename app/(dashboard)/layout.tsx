// app/(dashboard)/layout.tsx
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

// Simple synchronous token check — no async, no loading state
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    // If no token → redirect to login once, no loop
    if (!getToken()) {
      router.replace("/login");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // No spinner, no loading — just render
  // If user has no token, they'll be redirected instantly
  return (
    <div className="flex min-h-screen bg-slate-50">
      {!isMobile && <Sidebar />}
      <div className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0 overflow-hidden">
        <Header />
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      {isMobile && <BottomNav />}
    </div>
  );
}
