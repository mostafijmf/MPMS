import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="p-5">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div>
          <div className="h-7 sm:h-8 w-48 bg-muted rounded animate-pulse mb-1" />
          <nav aria-label="breadcrumb" data-slot="breadcrumb">
            <ol
              data-slot="breadcrumb-list"
              className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5"
            >
              <li data-slot="breadcrumb-item" className="inline-flex items-center gap-1.5">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              </li>
              <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" className="[&>svg]:size-3.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-right"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </li>
              <li data-slot="breadcrumb-item" className="inline-flex items-center gap-1.5">
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              </li>
              <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" className="[&>svg]:size-3.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-right"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </li>
              <li data-slot="breadcrumb-item" className="inline-flex items-center gap-1.5">
                <div className="h-4 w-28 bg-muted rounded animate-pulse" />
              </li>
            </ol>
          </nav>
        </div>
        <div>
          <div className="h-9 w-32 bg-muted rounded-sm animate-pulse" />
        </div>
      </div>
      <section className="overflow-hidden w-full flex items-center gap-3 pb-1 pt-3 border-b flex-wrap">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36 max-sm:hidden" />
        <Skeleton className="h-10 w-36 max-sm:hidden" />
        <Skeleton className="h-10 w-36 max-sm:hidden" />
      </section>
      <div className="w-full max-w-6xl mx-auto mt-8 pb-20">
        <Skeleton className="mb-6 h-52" />
        <div className="flex mb-6 gap-5">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="h-52 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 space-y-16" />
          <Skeleton />
        </div>
      </div>
    </div>
  );
};

export default Loading;
