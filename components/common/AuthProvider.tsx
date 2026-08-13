// components/common/AuthProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const hydrate = useAuthStore((state) => state.hydrate);
  const setHydrated = useAuthStore((state) => state.setHydrated);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("🔄 AuthProvider: Hydrating...");

      // Force hydrate from localStorage
      hydrate();

      // Mark as hydrated after a short delay
      const timer = setTimeout(() => {
        setHydrated();
        setIsReady(true);
        console.log("✅ AuthProvider: Hydration complete");
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [hydrate, setHydrated]);

  // Show nothing until hydrated (prevents flash)
  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
