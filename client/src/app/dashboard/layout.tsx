import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/header";
import { getUserProfile } from "@/fetch-api/user";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const {data} = await getUserProfile();
  return (
    <div className="flex">
      <Sidebar user={data?.data} className="max-lg:hidden" />
      <div className="w-full h-screen overflow-y-auto">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
