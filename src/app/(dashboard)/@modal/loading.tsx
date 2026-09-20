export default function ModalLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]" />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="h-6 w-44 animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-slate-100" />
        </div>

        <div className="space-y-4 p-6">
          <div className="h-12 animate-pulse rounded-lg bg-slate-100" />

          <div className="h-12 animate-pulse rounded-lg bg-slate-100" />

          <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
