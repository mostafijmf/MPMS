import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IProject } from "@/types";
import { Calendar, ChevronRight, DollarSign, User } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import ProjectActions from "./project-actions";
import { Button } from "@/components/ui/button";

const ProjectCard = ({ project }: { project: IProject }) => {
  const statusStyles = {
    planned: "capitalize bg-blue-500/10 text-blue-500 border-blue-500/20",
    active: "capitalize bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    completed: "capitalize bg-violet-500/10 text-violet-500 border-violet-500/20",
    archived: "capitalize bg-muted text-muted-foreground border-border",
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 h-full pt-0 pb-10 relative">
      <CardContent className="p-0">
        {/* <!-- Thumbnail --> */}
        <div className="relative h-44 overflow-hidden rounded-t-xl bg-muted">
          <Image
            src={project?.thumbnail || "/placeholder.jpeg"}
            alt={project?.title}
            width={1000}
            height={1000}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge className={statusStyles[project?.status]} variant="outline">
              {project?.status}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <ProjectActions project={project} />
          </div>
        </div>

        {/* <!-- Content --> */}
        <div className="p-5 space-y-4">
          <div>
            <Link href={`/dashboard/projects/${project?._id}`}>
              <h3 className="font-semibold text-lg leading-snug text-balance group-hover:text-primary transition-colors line-clamp-1">
                {project?.title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1">
              <User className="size-4" /> {project?.client}
            </p>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{project?.description}</p>

          <div className="space-y-2 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {moment(project?.startDate).format("ll")}
                {" - "}
                {moment(project?.endDate).format("ll")}
              </span>
            </div>
            <div className="flex items-center text-base font-semibold text-foreground">
              <DollarSign className="size-4.5" />
              <span>{project?.budget.toLocaleString()}</span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-5">
            <Button variant={"secondary"} className="w-full" asChild>
              <Link href={`/dashboard/projects/${project?._id}`}>
                View Details <ChevronRight className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
