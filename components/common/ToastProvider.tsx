// src/components/common/ToastProvider.tsx
"use client";

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#FFFFFF",
          color: "#0F172A",
          borderRadius: "12px",
          padding: "12px 16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "1px solid #E2E8F0",
        },
        success: {
          icon: "✅",
          style: {
            borderLeft: "4px solid #22C55E",
          },
        },
        error: {
          icon: "❌",
          style: {
            borderLeft: "4px solid #EF4444",
          },
        },
        loading: {
          icon: "⏳",
          style: {
            borderLeft: "4px solid #3B82F6",
          },
        },
      }}
    />
  );
};
