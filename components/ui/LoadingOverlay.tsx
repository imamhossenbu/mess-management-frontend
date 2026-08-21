// components/ui/LoadingOverlay.tsx
"use client";

import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
    message?: string;
}

export function LoadingOverlay({ message = "Deleting..." }: LoadingOverlayProps) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 bg-white rounded-2xl p-8 shadow-2xl min-w-[280px]">
                {/* Spinner */}
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-200" />
                    <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-red-600 border-r-red-600 border-b-transparent border-l-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-red-600 animate-pulse" />
                    </div>
                </div>

                {/* Message */}
                <p className="text-sm font-semibold text-slate-700 text-center">
                    {message}
                </p>

                <p className="text-xs text-slate-400 text-center">
                    Please wait...
                </p>

                {/* Progress bar */}
                <div className="w-full max-w-[200px] h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-red-500 rounded-full animate-progress" />
                </div>
            </div>

            <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}