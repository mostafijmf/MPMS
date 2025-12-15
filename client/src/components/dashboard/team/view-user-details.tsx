import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IUser } from "@/types";
import { Award, Briefcase, Calendar, Eye, Mail, X } from "lucide-react";
import moment from "moment";
import Link from "next/link";

const ViewUserDetails = ({ user }: { user: IUser }) => {
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant={"link"} className="p-0! h-max rounded-full">
              <Eye className="size-5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>View</TooltipContent>
      </Tooltip>
      <DialogContent
        className="w-full max-w-xl! p-0 border-none overflow-hidden"
        xClassName="text-white hover:text-black"
      >
        <DialogTitle className="sr-only"></DialogTitle>
        <div className="h-20 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950" />

        {/* Content Container */}
        <div className="relative px-8 pb-8">
          <div className="relative -mt-12 mb-5 flex items-end gap-5">
            <Avatar className="size-28 border-3 border-white shadow-lg">
              <AvatarImage src={user?.avatar || "/user.png"} alt={user?.name} />
              <AvatarFallback>{user?.name}</AvatarFallback>
            </Avatar>
            <div className="mb-3 flex flex-col gap-1">
              <Badge
                className={cn(
                  "capitalize font-medium px-3 py-1 text-sm text-white",
                  user?.role === "admin" ? "bg-blue-600" : user?.role === "manager" ? "bg-indigo-600" : "bg-slate-600"
                )}
              >
                {user?.role}
              </Badge>
            </div>
          </div>

          <div className="mb-8 space-y-2">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-4" />
              <Link href={`mailto:${user?.email}`} className="text-sm">
                {user?.email}
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            {/* Department */}
            <div className="border-b pb-5">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="size-4" />
                <h3 className="text-xs font-semibold uppercase tracking-wider">Department</h3>
              </div>
              <p className="text-sm text-muted-foreground">{user?.department || "—"}</p>
            </div>

            {/* Skills */}
            {user?.skills && user?.skills.length > 0 && (
              <div className="border-b pb-5">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="size-4" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider">Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user?.skills.map((skill) => (
                    <Badge key={skill} className="text-sm" variant={"default"}>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {user?.createdAt && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="size-4" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider">Created</h3>
                </div>
                <p className="text-sm text-muted-foreground">{moment(user?.createdAt).format("ll")}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserDetails;
