export function ContentSkeleton() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-10 w-3/4 bg-white/5 rounded-lg animate-pulse mb-4" />
        <div className="h-5 w-1/3 bg-white/5 rounded animate-pulse mb-12" />
        <div className="space-y-4">
          <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" />
          <div className="h-32 w-full bg-white/5 rounded-lg animate-pulse mt-8" />
          <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
