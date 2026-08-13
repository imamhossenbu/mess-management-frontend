/* eslint-disable react-hooks/set-state-in-effect */
// app/auth/callback/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Suspense } from "react";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const hasHandledCallback = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    // React Strict Mode can run effects twice in development
    if (hasHandledCallback.current) return;
    hasHandledCallback.current = true;

    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    const error = searchParams.get("error");

    console.log("🔑 Token:", token);
    console.log("👤 User Param:", userParam);

    // Handle error from Google
    if (error) {
      setStatus("error");
      setErrorMessage(decodeURIComponent(error));
      setTimeout(() => {
        router.replace(`/login?error=${encodeURIComponent(error)}`);
      }, 2000);
      return;
    }

    // Handle successful authentication
    if (token && userParam) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userParam));
        const user = {
          ...parsedUser,
          role: parsedUser.role ?? "MEMBER",
        };

        console.log("✅ Parsed User:", user);

        // Save to store
        setAuth(user, token);

        setStatus("success");

        // Redirect to dashboard after a short delay for visual feedback
        setTimeout(() => {
          router.replace("/dashboard");
        }, 1500);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        setStatus("error");
        setErrorMessage("Failed to process authentication data");
        setTimeout(() => {
          router.replace("/login?error=invalid_data");
        }, 2000);
      }
    } else {
      // No token or user data
      setStatus("error");
      setErrorMessage("No authentication data received");
      setTimeout(() => {
        router.replace("/login?error=no_token");
      }, 2000);
    }
  }, [searchParams, router, setAuth]);

  // Loading State
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative">
            {/* Outer ring animation */}
            <div className="w-20 h-20 rounded-full border-4 border-slate-200 mx-auto">
              <div className="w-full h-full rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
            </div>
            {/* Inner pulsing dot */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary-500"
            />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-xl font-semibold text-slate-800"
          >
            Completing Login
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-sm text-slate-500"
          >
            Please wait while we redirect you to your dashboard
          </motion.p>

          {/* Loading dots animation */}
          <div className="flex justify-center gap-1 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
                className="w-2 h-2 rounded-full bg-primary-400"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Success State
  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-xl font-semibold text-green-700"
          >
            Login Successful! 🎉
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-2 text-sm text-green-600"
          >
            Redirecting you to dashboard...
          </motion.p>

          {/* Success progress bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "linear" }}
            className="mt-4 h-1 bg-green-200 rounded-full overflow-hidden max-w-xs mx-auto"
          >
            <div className="h-full bg-green-500 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="text-center max-w-sm px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center"
          >
            <XCircle className="w-10 h-10 text-red-500" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-xl font-semibold text-red-700"
          >
            Authentication Failed
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-2 text-sm text-red-600"
          >
            {errorMessage || "Something went wrong. Please try again."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6"
          >
            <p className="text-xs text-red-400">Redirecting to login...</p>
            <div className="mt-3 h-1 bg-red-200 rounded-full overflow-hidden max-w-xs mx-auto">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "linear" }}
                className="h-full bg-red-500 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return null;
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
