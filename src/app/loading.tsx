export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-700">
      <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="h-3.5 w-3.5 animate-pulse rounded-full bg-teal-500" />
        <p className="text-sm font-semibold">Loading BCONZ...</p>
      </div>
    </div>
  );
}
