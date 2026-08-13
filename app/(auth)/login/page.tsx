/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
// app/(auth)/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // isLoading ekhane r use korchi na — oita profile query-r sathe mixed thake
  // tai full page-ke unmount kore dito. Login button-er nijer state ekhon
  // login.isPending diye track hocche.
  const { login } = useAuth();

  const searchParams = useSearchParams();

  // TanStack Query v5 hole "isPending", v4 hole "isLoading" — je version
  // package.json e ache shei onujayi eituku khali change korle hobe.
  const isSubmitting = login.isPending;

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "google_auth_failed") {
      setError("Google authentication failed. Please try again.");
    } else if (errorParam === "invalid_data") {
      setError("Invalid login data. Please try again.");
    } else if (errorParam === "no_token") {
      setError("No authentication token received. Please try again.");
    }
  }, [searchParams]);

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    login.mutate(
      { email, password },
      {
        onError: (error: any) => {
          const message =
            error.response?.data?.message || "Login failed. Please try again.";
          setError(message);
        },
      },
    );
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  // ❌ Age ekhane "if (isLoading) return <full page spinner>" chilo.
  // Eta form + error box shoho puro page-take unmount kore dito, tai
  // wrong email/password dile error dekha jacchilo na. Shomoshsha
  // fix korte eita shorasori remove kora hoyeche — spinner ekhon
  // shudhu submit button-er bhitore dekhabe (niche).

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-500 rounded-2xl text-white text-2xl font-bold mb-3">
            M
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2"
            >
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.276-3.276C17.548 1.394 14.974 0 12 0 7.323 0 3.279 2.793 1.333 6.762l3.933 3.003z"
              />
              <path
                fill="#34A853"
                d="M16.44 18.133A7.07 7.07 0 0 1 12 19.091c-2.306 0-4.354-.936-5.854-2.462l-3.754 3.754C4.815 22.206 8.144 24 12 24c2.957 0 5.637-1.073 7.698-2.878l-3.258-2.989z"
              />
              <path
                fill="#4A90E2"
                d="M23.76 10.503H12v4.343h6.63c-.451 2.43-2.343 3.82-4.63 3.82-1.957 0-3.675-1.154-4.461-2.81l-3.993 3.068C6.414 21.075 8.942 22.5 12 22.5c3.015 0 5.667-1.263 7.545-3.318l3.015-8.679z"
              />
            </svg>
            <span className="text-sm font-medium text-slate-700">
              Continue with Google
            </span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400">
                or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors({ ...fieldErrors, email: undefined });
                  }
                  if (error) setError(null);
                }}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 bg-white border ${
                  fieldErrors.email ? "border-red-500" : "border-slate-200"
                } rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm`}
                disabled={isSubmitting}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                     setPassword(e.target.value);
                     if (fieldErrors.password) {
                       setFieldErrors({ ...fieldErrors, password: undefined });
                     }
                     if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  className={`w-full px-4 pr-12 py-3 bg-white border ${
                    fieldErrors.password ? "border-red-500" : "border-slate-200"
                  } rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-primary-500 hover:text-primary-600 font-semibold"
          >
            Create one now
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-pulse text-slate-500">Loading auth...</div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
