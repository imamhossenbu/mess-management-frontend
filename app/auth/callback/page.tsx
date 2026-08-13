// app/auth/callback/page.tsx
"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const hasHandledCallback = useRef(false);

  useEffect(() => {
    // React Strict Mode can run effects twice in development. A Google
    // callback must only store the session and navigate once.
    if (hasHandledCallback.current) return;
    hasHandledCallback.current = true;

    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    console.log("🔑 Token:", token);
    console.log("👤 User Param:", userParam);

    if (token && userParam) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userParam));
        // Google callback payloads do not always include the application
        // role. Treat such users as members until the backend supplies one.
        const user = { ...parsedUser, role: parsedUser.role ?? "MEMBER" };
        console.log("✅ Parsed User:", user);

        // Save to store
        setAuth(user, token);

        // Redirect to dashboard
        router.replace("/dashboard");
      } catch (error) {
        console.error("Failed to parse user data:", error);
        router.replace("/login?error=invalid_data");
      }
    } else {
      const error = searchParams.get("error");
      router.replace(`/login${error ? `?error=${error}` : "?error=no_token"}`);
    }
  }, [searchParams, router, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto" />
        <p className="mt-4 text-slate-600 font-medium">Completing login...</p>
        <p className="text-sm text-slate-400 mt-1">
          Please wait while we redirect you
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto" />
            <p className="mt-4 text-slate-600 font-medium">Loading...</p>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
