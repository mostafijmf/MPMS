import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar className="max-lg:hidden" />
      <div className="w-full h-screen overflow-y-auto">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
