// app/(dashboard)/layout.tsx
"use client";

import { AuthGuard } from "@/components/common/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useAuth } from "@/lib/hooks/useAuth";
import { useMess } from "@/lib/hooks/useMess";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { currentMess, isLoading: messLoading } = useMess();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && isAuthenticated && !messLoading && !currentMess) {
      router.push("/select-mess");
    }
  }, [currentMess, messLoading, isAuthenticated, authLoading, mounted, router]);

  const isLoading = authLoading || messLoading || !mounted;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm font-semibold text-slate-500">Checking your mess details...</p>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-slate-50/80">
        {!isMobile && <Sidebar />}
        <div className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0">
          <Header />
          <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
        {isMobile && <BottomNav />}
      </div>
    </AuthGuard>
  );
}
