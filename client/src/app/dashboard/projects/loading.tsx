import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ChevronRight, DollarSign } from "lucide-react";

const Loading = () => {
  return (
    <div className="p-5">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div>
          <Skeleton className="sm:w-32 w-24 h-7 sm:h-8 mb-1" />

          <nav aria-label="breadcrumb">
            <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5">
              <li className="inline-flex items-center gap-1.5">
                <Skeleton className="w-20 h-4" />
              </li>
              <li role="presentation" aria-hidden="true" className="[&>svg]:size-3.5">
                <ChevronRight className="opacity-50" aria-hidden="true" />
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Skeleton className="w-16 h-4" />
              </li>
            </ol>
          </nav>
        </div>

        <Skeleton className="h-10 w-[140px] rounded-sm" />
      </div>
      <Skeleton className="h-12 w-full rounded-sm mt-5" />
      <div className="flex justify-between gap-5">
        <Skeleton className="h-20 w-full rounded-sm my-7" />
        <Skeleton className="h-20 w-full rounded-sm my-7" />
        <Skeleton className="h-20 w-full rounded-sm my-7" />
        <Skeleton className="h-20 w-full rounded-sm my-7" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 pt-6">
        <ProjectCardSkeleton />

        <ProjectCardSkeleton />

        <ProjectCardSkeleton />
      </div>
    </div>
  );
};

export default Loading;

function ProjectCardSkeleton() {
  return (
    <div className="relative flex flex-col rounded-sm border border-border bg-card text-card-foreground shadow-sm pb-[72px]">
      <div className="p-5 space-y-2.5">
        <Skeleton className="h-6 w-3/4" />

        <div className="space-y-2 pt-1">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-3/4" />
        </div>

        <div className="space-y-2 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            <Skeleton className="h-3 w-40" />
          </div>

          <div className="flex items-center gap-1">
            <DollarSign className="size-4.5 text-foreground" aria-hidden="true" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-5">
        <Skeleton className="h-10 w-full rounded-sm" />
      </div>
    </div>
  );
}
