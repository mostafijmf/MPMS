import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
