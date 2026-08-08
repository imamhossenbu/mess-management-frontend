// app/(dashboard)/layout.tsx
"use client";

import { AuthGuard } from "@/components/common/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");

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
