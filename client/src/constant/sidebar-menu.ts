import { IUserRole } from "@/types";
import { FolderKanban, LayoutGrid, LucideProps, Users } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface SidebarMenu {
  label: string;
  path: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  roleAccess: IUserRole[]
}

export const sidebarMenu: SidebarMenu[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutGrid,
    roleAccess: ["member", "manager", "admin"],
  },
  {
    label: "Projects",
    path: "/dashboard/projects",
    icon: FolderKanban,
    roleAccess: ["member", "manager", "admin"],
  },
  {
    label: "Team",
    path: "/dashboard/team",
    icon: Users,
    roleAccess: ["admin"],
  },
];