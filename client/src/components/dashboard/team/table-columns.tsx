"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import TableAction from "./table-action";
import { Badge } from "@/components/ui/badge";
import { ShieldUser } from "lucide-react";
import { cn } from "@/lib/utils";

export const teamColumns: ColumnDef<IUser>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-10">
            <AvatarImage src={user?.avatar || "/user.png"} />
            <AvatarFallback>{user?.name}</AvatarFallback>
          </Avatar>
          <h3 className="text-base font-medium">{user.name}</h3>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Badge
          className={cn(
            "capitalize text-sm text-white",
            user?.role === "admin" ? "bg-blue-600" : user?.role === "manager" ? "bg-indigo-600" : "bg-slate-600"
          )}
        >
          <ShieldUser className="size-4!" />
          {user?.role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "createdAt",
    header: "Since",
    cell: ({ row }) => moment(row?.original?.createdAt).format("ll") || "",
  },
  {
    accessorKey: "action",
    header: () => <div className="text-right">Action</div>,
    size: 150,
    cell: ({ row }) => <TableAction data={row?.original} />,
  },
];
