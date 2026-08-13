/* eslint-disable react/no-unescaped-entities */
// components/common/AuthGuard.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
  roles?: string | string[];
  redirectTo?: string;
}

export function AuthGuard({
  children,
  roles,
  redirectTo = "/login",
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const router = useRouter();

  console.log("🔒 AuthGuard state:", {
    isAuthenticated,
    isLoading,
    user: user?.name,
    roles,
  });

  // ✅ Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("🔴 Not authenticated, redirecting to:", redirectTo);
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, redirectTo, router]);

  // ✅ Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // ✅ Check role-based access
  if (roles && !hasRole(roles)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚫</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
          <p className="text-slate-500 mt-2">
            You don't have permission to view this page.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
