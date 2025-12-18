"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ISprint, ITask } from "@/types";
import { Calendar, Clock, Plus } from "lucide-react";
import AddFormModal from "./add-form-modal";
import { cn, nameSplitter } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";
import { toast } from "sonner";
import { updateTaskStatusById } from "@/fetch-api/task";
import ViewTaskModal from "./view-task-modal";

type TaskStatus = ITask["status"];

export const TASK_COLUMNS = [
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Review", value: "review" },
  { label: "Done", value: "done" },
];

const TaskBoard = ({ sprint, tasks }: { sprint: ISprint; tasks: ITask[] }) => {
  const [isFormModal, setIsFormModal] = useState<{
    projectId: string;
    sprintId: string;
    status: ITask["status"];
  } | null>(null);
  const [taskList, setTaskList] = useState<ITask[]>(tasks);
  const [isViewTask, setIsViewTask] = useState<ITask | null>(null);
  const [activeCol, setActiveCol] = useState<string | null>(null);

  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  // <!-- Handle Fetch API -->
  const handleTaskUpdate = async (taskId: string, status: TaskStatus) => {
    setTaskList((prev) => prev.map((task) => (task._id === taskId ? { ...task, status } : task)));

    toast.promise(
      new Promise(async (resolve, reject) => {
        const { error, message, success } = await updateTaskStatusById(taskId, status);
        if (success) resolve(message);
        if (error) reject(message);
      }),
      {
        loading: "Updating...",
        success: (data: any) => data,
        error: (data: any) => data,
      }
    );
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");

    const task = taskList.find((t) => t._id === taskId);
    if (!task || task.status === status) return;

    handleTaskUpdate(taskId, status);
  };

  return (
    <section className="max-w-450">
      <div className="flex overflow-x-auto overflow-visible snap-x snap-mandatory gap-x-4 gap-y-6 py-7 px-2 min-h-full">
        {TASK_COLUMNS.map((col) => {
          const colTasks = taskList.filter((t) => t.status === col.value);

          return (
            <div
              key={col.value}
              onDragOver={(e) => {
                handleDragOver(e);
                setActiveCol(col.value);
              }}
              onDrop={(e) => {
                handleDrop(e, col.value as TaskStatus);
                setActiveCol(null);
              }}
              className={cn(
                "min-w-[320px] w-full snap-start bg-accent rounded group border transition-all duration-300 hover:shadow-md",
                activeCol === col.value && "ring-2 ring-primary"
              )}
            >
              <h4 className={"text-sm uppercase font-medium p-4"}>{col.label}</h4>

              <div className="px-3 space-y-2">
                {colTasks.map((task) => {
                  const assignsLen = task?.assigns?.length;

                  return (
                    <Card
                      key={task?._id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, task?._id)}
                      onClick={() => setIsViewTask(task)}
                      className={cn(
                        "p-4 rounded-sm shadow border-none cursor-move hover:shadow-md transition-all gap-3"
                      )}
                    >
                      <CardHeader className="p-0 flex justify-between items-center gap-2">
                        <Badge className="capitalize">{task?.priority}</Badge>

                        {assignsLen ? (
                          <div className="*:data-[slot=avatar]:ring-primary/5 flex -space-x-3 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                            {task?.assigns.slice(0, 2).map((member) => (
                              <Avatar key={member?._id} className="shadow-sm">
                                <AvatarImage src={member?.avatar || "/user.png"} alt={member?.name} />
                                <AvatarFallback>{nameSplitter(member?.name)}</AvatarFallback>
                              </Avatar>
                            ))}

                            {assignsLen > 3 ? (
                              <Avatar className="shadow-sm">
                                <AvatarFallback>{assignsLen - 2}+</AvatarFallback>
                              </Avatar>
                            ) : null}
                          </div>
                        ) : null}
                      </CardHeader>
                      <CardContent className="p-0">
                        <h4 className="font-medium text-primary text-sm mb-1">{task?.title}</h4>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task?.description}</p>

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                          <div className="flex items-center font-medium">
                            <Clock className="size-3.5 mr-1" />
                            {task?.estimateHours ? task?.estimateHours + "h" : "None"}
                          </div>
                          <div
                            className={cn(
                              "flex items-center font-medium",
                              new Date(task?.dueDate) < new Date() ? "text-destructive" : ""
                            )}
                          >
                            <Calendar className="size-3.5 mr-1" />
                            {task?.dueDate ? moment(task?.dueDate).format("ll") : "None"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <div className={"p-3"}>
                <Button
                  variant={"ghost"}
                  className={
                    "w-full md:group-hover:opacity-100 md:opacity-0 hover:bg-background transition-all duration-300 my-5"
                  }
                  onClick={() =>
                    setIsFormModal({
                      projectId: sprint.projectId as string,
                      sprintId: sprint?._id as string,
                      status: col.value as TaskStatus,
                    })
                  }
                >
                  <Plus className="size-5" /> Create Task
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <AddFormModal state={isFormModal} onClose={() => setIsFormModal(null)} />
      <ViewTaskModal isOpen={isViewTask} setIsOpen={setIsViewTask} />
    </section>
  );
};

export default TaskBoard;
