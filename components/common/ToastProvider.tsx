// components/common/ToastProvider.tsx
"use client";

import { Toaster, toast, useToasterStore } from "react-hot-toast";
import { useEffect } from "react";

export function ToastProvider() {
  const { toasts } = useToasterStore();

  // Limit visible toasts to 1 (keep the newest one, dismiss previous ones)
  useEffect(() => {
    const visibleToasts = toasts.filter((t) => t.visible);
    if (visibleToasts.length > 1) {
      visibleToasts.slice(0, -1).forEach((t) => toast.dismiss(t.id));
    }
  }, [toasts]);


  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#363636",
          color: "#fff",
        },
        success: {
          duration: 2500,
          iconTheme: {
            primary: "#22c55e",
            secondary: "#fff",
          },
        },
        error: {
          duration: 3500,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}

