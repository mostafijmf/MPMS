import { IUserRole } from "@/types";
import { LayoutGrid, LucideProps, Users } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface SidebarMenu {
  label: string;
  path: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  roleAccess: IUserRole
}

export const sidebarMenu: SidebarMenu[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutGrid,
    roleAccess: "member",
  },
  {
    label: "Team",
    path: "/dashboard/team",
    icon: Users,
    roleAccess: "member",
  },
];