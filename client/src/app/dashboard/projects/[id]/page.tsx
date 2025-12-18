import PageContainer from "@/components/dashboard/page-container";
import AddSprint from "@/components/dashboard/projects/sprint/add-sprint";
import ViewPageHeader from "@/components/dashboard/projects/overview/view-page-header";
import ErrorPage from "@/components/error-page";
import { getProjectById } from "@/fetch-api/project";
import { getSprintsByProjectId } from "@/fetch-api/sprint";
import { IProject } from "@/types";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock, DollarSign, FileText, MessageSquare, Users } from "lucide-react";
import moment from "moment";

export const metadata: Metadata = {
  title: "Project Overview",
};

interface ProjectDetailsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}
const ProjectDetailsPage = async ({ params }: ProjectDetailsPageProps) => {
  const { id } = await params;
  const [{ data, error, message }, sprintResponse] = await Promise.all([getProjectById(id), getSprintsByProjectId(id)]);

  if (error || sprintResponse?.error) return <ErrorPage error={error ? message : sprintResponse?.message} />;

  const project: IProject = data?.data;

  const breadcrumb = [
    { label: "Projects", path: "/dashboard/projects" },
    { label: "Project overview", path: `/dashboard/projects/${id}` },
  ];

  const statusStyles = {
    planned: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    completed: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    archived: "bg-muted text-muted-foreground border-border",
  };

  return (
    <PageContainer title={project?.title} breadcrumb={breadcrumb} headerRightContent={<AddSprint project={project} />}>
      <div className="min-h-[calc(100vh-160px)] overflow-y-auto bg-background">
        <ViewPageHeader projectId={id} sprints={sprintResponse?.data?.data?.sprints || []} />

        {/* <!-- Project Overview --> */}
        <section className="w-full max-w-6xl mx-auto mt-8 pb-20">
          <div className="mb-6">
            <div className="relative h-52 border rounded-xl overflow-hidden mb-6 bg-muted">
              <Image
                src={project?.thumbnail || "/placeholder.jpeg"}
                alt={project?.title}
                width={1200}
                height={1000}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-balance mb-2">{project?.title}</h1>
                    <p className="text-muted-foreground">{project?.client}</p>
                  </div>
                  <Badge className={statusStyles[project?.status]} variant="outline">
                    {project?.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex max-md:flex-col items-center justify-between py-1 md:overflow-x-auto gap-3">
              <Card className="border-border/50 py-0 w-full mx-1">
                <CardContent className="p-5 flex flex-nowrap items-center gap-3 min-w-64">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Timeline</p>
                    <p className="font-semibold text-base">{moment(project?.endDate).fromNow()}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50 py-0 w-full mx-1">
                <CardContent className="p-5 flex flex-nowrap items-center gap-3 min-w-64">
                  <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <DollarSign className="size-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-semibold text-base">${project?.budget.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50 py-0 w-full mx-1">
                <CardContent className="p-5 flex flex-nowrap items-center gap-3 min-w-64">
                  <div className="size-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Users className="size-5 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                    <p className="font-semibold text-base">{0} members</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50 py-0 w-full mx-1">
                <CardContent className="p-5 flex flex-nowrap items-center gap-3 min-w-64">
                  <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Clock className="size-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Sprint</p>
                    <p className="font-semibold text-base">Sprint 0</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-16">
              <Card className="gap-3">
                <CardHeader>
                  <CardTitle>About This Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-pretty">{project?.description}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Task completed</p>
                      <p className="text-xs text-muted-foreground">User authentication system</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">New comment</p>
                      <p className="text-xs text-muted-foreground">On Design product catalog UI</p>
                      <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Sprint started</p>
                      <p className="text-xs text-muted-foreground">Sprint 3: Product Management</p>
                      <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};

export default ProjectDetailsPage;
