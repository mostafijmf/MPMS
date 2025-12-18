import { ISprint } from "@/types";
import { Calendar } from "lucide-react";
import moment from "moment";
import { getSprintById } from "@/fetch-api/sprint";
import ErrorPage from "@/components/error-page";
import TaskBoard from "../task/task-board";
import { Suspense } from "react";
import { getTaskBySprintProjectIds } from "@/fetch-api/task";
import KanbanSkeleton from "./kanban-loading";
import SprintAction from "./sprint-action";

interface SprintTaskIdsProps {
  projectId: string;
  sprintId: string;
}
const Sprint = async ({ sprintId, projectId }: SprintTaskIdsProps) => {
  const { data, error, message } = await getSprintById(sprintId);

  if (error) return <ErrorPage error={message} />;

  const sprint: ISprint = data?.data;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-5">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">{sprint?.title}</h1>
          <p className="text-sm flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-4" />
            {moment(sprint?.startDate).format("ll")} — {moment(sprint?.endDate).format("ll")}
          </p>
        </div>
        <SprintAction sprint={sprint}/>
      </div>
      <Suspense fallback={<KanbanSkeleton />}>
        <TaskPromise projectId={projectId} sprintId={sprintId} sprint={sprint} />
      </Suspense>
    </div>
  );
};

export default Sprint;

const TaskPromise = async ({ projectId, sprintId, sprint }: SprintTaskIdsProps & { sprint: ISprint }) => {
  const { data, error, message } = await getTaskBySprintProjectIds({ projectId, sprintId });

  if (error) return <ErrorPage error={message} />;

  return <TaskBoard sprint={sprint} tasks={data?.data?.tasks || []} />;
};
