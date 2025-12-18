import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { nameSplitter } from "@/lib/utils";
import { IProject } from "@/types";
import { User } from "lucide-react";

const TeamMembers = ({ project }: { project: IProject }) => {
  const memberLen = project?.members?.length || 0;

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-lg">
          Team Member{memberLen ? (memberLen > 1 ? `s (${memberLen})` : memberLen) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {project?.members?.map((member, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Avatar className="size-10 shadow">
                <AvatarImage src={member?.avatar || "/user.png"} alt={member?.name} />
                <AvatarFallback>{nameSplitter(member?.name || "")}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm leading-tight">{member?.name}</p>
                <p className="text-sm text-muted-foreground truncate">{member?.email}</p>
              </div>
              <Badge variant={"secondary"} className="capitalize min-w-19">
                {member?.role}
              </Badge>
            </div>
          ))}
        </div>
        <CardFooter className="px-0 pt-4">
          <Button variant={"secondary"} className="w-full rounded-full">
            <User className="size-5" />
            Add Member
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default TeamMembers;
