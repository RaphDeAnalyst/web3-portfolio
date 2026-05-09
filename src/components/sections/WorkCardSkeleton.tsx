export function WorkCardSkeleton() {
  return (
    <div className="p-8 border border-border bg-background/50 animate-pulse">
      {/* Title skeleton */}
      <div className="h-6 bg-border/40 rounded mb-4 w-3/4"></div>

      {/* Description skeleton - 3 lines */}
      <div className="space-y-2 mb-5">
        <div className="h-4 bg-border/40 rounded w-full"></div>
        <div className="h-4 bg-border/40 rounded w-full"></div>
        <div className="h-4 bg-border/40 rounded w-2/3"></div>
      </div>

      {/* Tags skeleton */}
      <div className="flex flex-wrap gap-2">
        <div className="h-6 bg-border/40 rounded w-20"></div>
        <div className="h-6 bg-border/40 rounded w-24"></div>
        <div className="h-6 bg-border/40 rounded w-16"></div>
      </div>
    </div>
  )
}
