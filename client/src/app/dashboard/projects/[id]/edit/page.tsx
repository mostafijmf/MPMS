import PageContainer from "@/components/dashboard/page-container";
import ProjectsForm from "@/components/dashboard/projects/projects-form";
import ErrorPage from "@/components/error-page";
import { getProjectById } from "@/fetch-api/project";
import { IProject } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Project",
};

interface EditPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}
const EditPage = async ({ params }: EditPageProps) => {
  const { id } = await params;
  const { data, error, message } = await getProjectById(id);

  if (error) return <ErrorPage error={message} />;

  const project: IProject = data?.data;

  const breadcrumb = [
    { label: "Projects", path: "/dashboard/projects" },
    { label: "Project overview", path: `/dashboard/projects/${id}` },
  ];

  return (
    <PageContainer title={project?.title} breadcrumb={breadcrumb}>
      <ProjectsForm type="update" project={project} />
    </PageContainer>
  );
};

export default EditPage;
