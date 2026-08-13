// app/(dashboard)/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-36 rounded-2xl bg-slate-200" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-56 rounded-2xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
