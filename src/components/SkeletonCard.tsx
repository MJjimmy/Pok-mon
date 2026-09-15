export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/5 p-3">
      <div className="skeleton w-full aspect-square rounded-xl mb-3" />
      <div className="skeleton h-3 w-10 rounded mb-1.5" />
      <div className="skeleton h-4 w-20 rounded mb-2" />
      <div className="flex gap-1.5">
        <div className="skeleton h-4 w-12 rounded-full" />
        <div className="skeleton h-4 w-12 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="flex flex-col animate-fade-in">
      <div className="h-64 skeleton" />
      <div className="p-4 space-y-4">
        <div className="skeleton h-6 w-32 rounded" />
        <div className="flex gap-2">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="skeleton h-16 rounded-xl" />
          <div className="skeleton h-16 rounded-xl" />
        </div>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton h-3 w-12 rounded" />
            <div className="skeleton flex-1 h-2.5 rounded-full" />
            <div className="skeleton h-4 w-8 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
