"use client";
import { sidebarMenu } from "@/constant/sidebar-menu";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { logout } from "@/fetch-api/auth";
import { toast } from "sonner";

const Sidebar = () => {
  const pathname = usePathname();

  const handleLogout = async () => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        const { error, message, success } = await logout();
        if (success) {
          window.location.reload();
          resolve(message);
        }
        if (error) reject(message);
      }),
      {
        loading: "Loading...",
        success: (data: any) => data,
        error: (data: any) => data,
      }
    );
  };

  return (
    <aside className="min-w-64 h-screen sticky top-0 border-r overflow-hidden">
      <div className="px-4 h-16 border-b grid place-items-center">
        <h1 className="text-2xl font-semibold">MPMS</h1>
      </div>
      <div className="h-[calc(100%-64px)] flex flex-col justify-between overflow-y-auto">
        <ul className="space-y-1 px-3 my-3">
          {sidebarMenu.map((item, i) => (
            <li key={i}>
              <Button
                asChild
                variant={pathname === item.path ? "secondary" : "ghost"}
                size={"lg"}
                className="w-full h-11 justify-start rounded-sm cursor-pointer"
              >
                <Link href={item.path}>
                  {<item.icon className="size-5" />}
                  {item.label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
        {/* <ToggleTheme /> */}
        <div className="px-3 pb-5">
          <Button
            onClick={handleLogout}
            variant={"ghost"}
            size={"lg"}
            className="w-full h-11 justify-start rounded-sm cursor-pointer"
          >
            <LogOut className="size-5" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
