import PageContainer from "@/components/dashboard/page-container";
import ProjectsFilter from "@/components/dashboard/projects/filter";
import ProjectCard from "@/components/dashboard/projects/project-card";
import ErrorPage from "@/components/error-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllProjects } from "@/fetch-api/project";
import { IProject } from "@/types";
import { DollarSign, FolderKanban, List, Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects",
};

const ProjectsPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {
  const query = await searchParams;
  const { data, error, message } = await getAllProjects({
    limit: Number(query?.limit || 10),
    page: Number(query?.page || 1),
    search: query?.search || "",
    status: query?.status || "",
  });

  if (error) return <ErrorPage error={message} />;

  const projects: IProject[] = data?.data?.projects || [];

  return (
    <PageContainer
      title="Projects"
      breadcrumb={{ label: "Projects", path: "/projects" }}
      headerRightContent={
        <Button asChild>
          <Link href={"/dashboard/projects/create"}>
            <Plus className="size-5" /> New Project
          </Link>
        </Button>
      }
    >
      <div className="min-h-screen bg-background py-6">
        <div className="flex flex-col gap-6 mb-8">
          {/* <!-- Filter --> */}
          <ProjectsFilter />

          {/* <!-- Stats --> */}
          <div className="flex max-md:flex-col items-center justify-between py-1 md:overflow-x-auto gap-3">
            <Card className="border-border/50 py-0 w-full mx-1">
              <CardContent className="p-5 min-w-64 flex flex-nowrap items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold mt-1">{projects?.length}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderKanban className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 py-0 w-full mx-1">
              <CardContent className="p-5 min-w-64 flex flex-nowrap items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold mt-1 text-emerald-500">
                    {projects.filter((p) => p.status === "active").length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <List className="h-6 w-6 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 py-0 w-full mx-1">
              <CardContent className="p-5 min-w-64 flex flex-nowrap items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold mt-1 text-violet-500">
                    {projects.filter((p) => p.status === "completed").length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <List className="h-6 w-6 text-violet-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 py-0 w-full mx-1">
              <CardContent className="p-5 min-w-64 flex flex-nowrap items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold mt-1">
                    ${(projects.reduce((sum, p) => sum + p.budget, 0) / 1000).toFixed(0)}k
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* <!-- Projects Grid --> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project?._id} project={project} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default ProjectsPage;
