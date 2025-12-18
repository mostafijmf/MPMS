import PageContainer from "@/components/dashboard/page-container";
import KanbanSkeleton from "@/components/dashboard/projects/sprint/kanban-loading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  const breadcrumb = [
    { label: "Projects", path: "/dashboard/projects" },
    { label: "Project overview", path: `/dashboard/projects` },
    { label: "Loading...", path: `` },
  ];
  return (
    <PageContainer title={"Loading..."} breadcrumb={breadcrumb}>
      <div className="min-h-[calc(100vh-160px)] overflow-y-auto bg-background">
        <section className="overflow-hidden w-full flex items-center gap-3 pb-1 pt-3 border-b flex-wrap">
          <Button
            variant={"link"}
            size={"sm"}
            className={"rounded-none hover:no-underline"}
          >
            Overview
          </Button>
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36 max-sm:hidden" />
          <Skeleton className="h-10 w-36 max-sm:hidden" />
          <Skeleton className="h-10 w-36 max-sm:hidden" />
        </section>

        <div className="mt-4">
          <Skeleton className="h-13" />
          <KanbanSkeleton />
        </div>
      </div>
    </PageContainer>
  );
};

export default Loading;
