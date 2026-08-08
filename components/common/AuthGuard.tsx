/* eslint-disable react/no-unescaped-entities */
// src/components/common/AuthGuard.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { SkeletonCard } from "@/components/ui/Skeleton";

interface AuthGuardProps {
  children: ReactNode;
  roles?: string | string[];
  redirectTo?: string;
}

export const AuthGuard = ({
  children,
  roles,
  redirectTo = "/login",
}: AuthGuardProps) => {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, redirectTo, router]);

  // Role-based access
  if (isAuthenticated && roles && !hasRole(roles)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
          <p className="text-slate-500 mt-2">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <SkeletonCard />
        <div className="mt-4 space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
