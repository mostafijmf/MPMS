import PageContainer from "@/components/dashboard/page-container";
import { teamColumns } from "@/components/dashboard/team/table-columns";
import TableFilter from "@/components/dashboard/team/table-filter";
import TeamForm from "@/components/dashboard/team/team-form";
import { DataTable } from "@/components/data-table";
import PaginationController from "@/components/pagination-controller";
import { getAllUsersByAdmin } from "@/fetch-api/user";

const TeamPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {
  const query = await searchParams;

  const { data } = await getAllUsersByAdmin({
    limit: Number(query?.limit || 20),
    page: Number(query?.page || 1),
    search: query?.search || "",
    role: query?.role || "",
  });

  return (
    <PageContainer title="Manage Team" breadcrumb={{ label: "Team", path: "/team" }} headerRightContent={<TeamForm />}>
      <div className="py-5">
        <TableFilter />
        <DataTable columns={teamColumns} data={data?.data?.users || []} />
        <PaginationController pagination={data?.data?.pagination} />
      </div>
    </PageContainer>
  );
};

export default TeamPage;
