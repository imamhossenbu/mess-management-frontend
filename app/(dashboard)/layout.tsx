// app/(dashboard)/layout.tsx
"use client";

import { AuthGuard } from "@/components/common/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
