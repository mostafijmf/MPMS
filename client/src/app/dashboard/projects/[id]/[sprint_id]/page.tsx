import PageContainer from "@/components/dashboard/page-container";
import AddSprint from "@/components/dashboard/projects/sprint/add-sprint";
import Sprint from "@/components/dashboard/projects/sprint/sprint";
import ViewPageHeader from "@/components/dashboard/projects/overview/view-page-header";
import ErrorPage from "@/components/error-page";
import { Skeleton } from "@/components/ui/skeleton";
import { getProjectById } from "@/fetch-api/project";
import { getSprintsByProjectId } from "@/fetch-api/sprint";
import { IProject } from "@/types";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sprint",
};

interface SprintPageProps {
  params: Promise<{ sprint_id: string; id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}
const SprintPage = async ({ params }: SprintPageProps) => {
  const { sprint_id, id } = await params;
  const [{ data, error, message }, sprintResponse] = await Promise.all([getProjectById(id), getSprintsByProjectId(id)]);

  if (error || sprintResponse?.error) return <ErrorPage error={error ? message : sprintResponse?.message} />;

  const project: IProject = data?.data;

  const breadcrumb = [
    { label: "Projects", path: "/dashboard/projects" },
    { label: "Project overview", path: `/dashboard/projects/${id}` },
    { label: "Sprint", path: `` },
  ];

  return (
    <PageContainer title={project?.title} breadcrumb={breadcrumb} headerRightContent={<AddSprint project={project} />}>
      <div className="min-h-[calc(100vh-160px)] overflow-y-auto bg-background">
        <ViewPageHeader projectId={id} pathname={sprint_id} sprints={sprintResponse?.data?.data?.sprints || []} />

        <Suspense fallback={<Skeleton className="w-full h-20" />}>
          <Sprint projectId={id} sprintId={sprint_id} />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default SprintPage;
