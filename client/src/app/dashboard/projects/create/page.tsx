import PageContainer from "@/components/dashboard/page-container";
import ProjectsForm from "@/components/dashboard/projects/projects-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a Project",
};

const CreateProjectPage = () => {
  const breadcrumb = [
    { label: "Projects", path: "/dashboard/projects" },
    { label: "Form", path: "/dashboard/projects/create" },
  ];

  return (
    <PageContainer title="Projects" breadcrumb={breadcrumb}>
      <ProjectsForm type="create" />
    </PageContainer>
  );
};

export default CreateProjectPage;
