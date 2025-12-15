import { Skeleton } from "@/components/ui/skeleton";

export default function TeamSkeleton() {
  return (
    <div className="p-5">
      <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
        <div className="space-y-2">
          <Skeleton className="h-7 sm:h-8 w-40" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        <Skeleton className="h-10 w-32" />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="border-b bg-muted/50 p-4">
          <div className="flex gap-4">
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>

        {/* Table Rows */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="border-b last:border-b-0 p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-4 rounded" />

              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>

              <Skeleton className="h-6 w-20 rounded-full ml-auto" />

              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}
