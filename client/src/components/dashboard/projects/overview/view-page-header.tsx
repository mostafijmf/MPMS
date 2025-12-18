import { Button } from "@/components/ui/button";
import { ISprint } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProjectDetailsProps {
  pathname?: string;
  projectId: string;
  sprints: ISprint[];
}
const ViewPageHeader = ({ pathname, projectId, sprints }: ProjectDetailsProps) => {
  return (
    <section className="overflow-hidden w-full flex items-center gap-3 pb-1 pt-3 border-b flex-wrap">
      <Button
        asChild
        variant={"link"}
        size={"sm"}
        className={cn(
          "border-b-2 hover:border-primary rounded-none hover:no-underline",
          !pathname ? " border-primary" : "border-background"
        )}
      >
        <Link href={`/dashboard/projects/${projectId}`}>Overview</Link>
      </Button>
      {sprints.map((sprint) => (
        <Button
          key={sprint?._id}
          asChild
          variant={"link"}
          size={"sm"}
          className={cn(
            "border-b-2 hover:border-primary rounded-none hover:no-underline",
            pathname === sprint?._id ? " border-primary" : "border-background"
          )}
        >
          <Link href={`/dashboard/projects/${projectId}/${sprint?._id}`}>{sprint?.title}</Link>
        </Button>
      ))}
    </section>
  );
};

export default ViewPageHeader;
