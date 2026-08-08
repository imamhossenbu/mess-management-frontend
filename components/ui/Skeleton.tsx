// components/ui/Skeleton.tsx
"use client";

export const Skeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={`
        relative overflow-hidden rounded-xl bg-slate-200/70
        before:absolute before:inset-0 before:-translate-x-full
        before:animate-[shimmer_2s_infinite]
        before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent
        ${className}
      `}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-5 border border-white/50">
      <Skeleton className="h-5 w-1/3 mb-3" />
      <Skeleton className="h-3 w-2/3 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
};
