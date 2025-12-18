import { ITask } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TASK_COLUMNS } from "./task-board";
import { AlertCircle, Calendar, Clock, MessageSquare, Pencil, Send, Trash2, UserIcon } from "lucide-react";
import moment from "moment";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteTaskById } from "@/fetch-api/task";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import EditFormModal from "./edit-form-modal";

interface ViewTaskModalProps {
  isOpen: ITask | null;
  setIsOpen: (val: null) => void;
}
const ViewTaskModal = ({ isOpen: task, setIsOpen }: ViewTaskModalProps) => {
  const [isFormModal, setIsFormModal] = useState<ITask | null>(null);

  const onClose = () => {
    setIsFormModal(null);
    setIsOpen(null);
  };

  return (
    <>
      <Dialog open={task ? true : false} onOpenChange={onClose}>
        <DialogContent xClassName="top-3" className="p-0 gap-0 max-sm:pb-10 max-w-4xl! max-h-full overflow-y-auto">
          <DialogHeader className="bg-slate-50 dark:bg-accent px-7 py-4 border-b">
            <DialogTitle className="sr-only"></DialogTitle>
            <div className="flex items-center justify-between">
              <Badge variant={"outline"} className="px-3 capitalize bg-blue-50 border-blue-300 text-blue-600">
                {TASK_COLUMNS.find((t) => t.value === task?.status)?.label}
              </Badge>
              <div className="flex gap-3 mr-10">
                <Button size={"sm"} variant={"outline"} title="Edit" onClick={() => setIsFormModal(task)}>
                  <Pencil className="size-4" />
                </Button>
                <DeleteAction task={task!} setIsOpen={setIsOpen} />
              </div>
            </div>
          </DialogHeader>
          <div className="flex md:flex-row flex-col">
            <div className="md:flex-1 p-7">
              <div>
                <h1 className="text-xl font-semibold pb-2">{task?.title}</h1>
                <p className="text-sm text-muted-foreground">{task?.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-6 py-6">
                <div className="flex items-start">
                  <div className="p-2 rounded-md bg-accent flex items-center justify-center mr-3 text-muted-foreground">
                    <Clock className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">Estimated Time</p>
                    <p className={"text-sm font-semibold"}>${task?.estimateHours} hours</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 rounded-md bg-accent flex items-center justify-center mr-3 text-muted-foreground">
                    <Calendar className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">Due Date</p>
                    <p className={"text-sm font-semibold"}>{moment(task?.dueDate).format("ll")}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 rounded-md bg-accent flex items-center justify-center mr-3 text-muted-foreground">
                    <AlertCircle className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">Priority</p>
                    <Badge
                      variant={"secondary"}
                      className={cn(
                        "rounded px-2.5 py-0 h-auto text-sm font-semibold capitalize",
                        task?.priority === "high"
                          ? "text-red-600 bg-red-100"
                          : task?.priority === "medium"
                          ? "bg-amber-100 text-amber-600"
                          : ""
                      )}
                    >
                      {task?.priority}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 rounded-md bg-accent flex items-center justify-center mr-3 text-muted-foreground">
                    <AlertCircle className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">Priority</p>
                    <p className={"text-sm font-semibold capitalize"}>{moment(task?.createdAt).format("ll")}</p>
                  </div>
                </div>
              </div>
              <div className="pt-5 border-t">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-muted-foreground" />
                  Comments
                </h3>
                <div className="space-y-4">
                  <div className="text-center py-6 bg-slate-50 dark:bg-accent rounded-md border border-dashed">
                    <p className="text-sm text-muted-foreground">No comments yet.</p>
                  </div>

                  <div className="flex items-start space-x-3 mt-4 pt-4">
                    <Avatar className="shrink-0 size-8">
                      <AvatarImage src={"/user.png"} />
                    </Avatar>
                    <div className="flex-1 relative">
                      <textarea
                        className="w-full bg-background border rounded-md px-4 py-2 pr-12 text-sm focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none"
                        placeholder="Write a comment..."
                        rows={2}
                      />
                      <Button className="absolute right-2 top-2.5">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-68 p-7 border-l bg-slate-50 dark:bg-accent">
              <div>
                <h3 className="text-xs mb-4 font-bold text-muted-foreground uppercase tracking-widest">Assignee</h3>
                <div className="space-y-2 max-h-[50vh] h-full pb-4 overflow-y-auto">
                  {task?.assigns && task?.assigns?.length > 0 ? (
                    task.assigns.map((user) => (
                      <div key={user?._id} className="flex items-center gap-2 p-2 bg-background rounded-md shadow-sm">
                        <Avatar>
                          <AvatarImage src={user?.avatar || "/user.png"} />
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold">{user?.name || "None"}</p>
                          <p className="text-xs text-muted-foreground">{user?.department || "None"}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center p-3 bg-slate-100 dark:bg-zinc-900 rounded-md text-muted-foreground italic text-sm">
                      <UserIcon className="w-5 h-5 mr-2" /> Unassigned
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <EditFormModal state={isFormModal} onClose={onClose} />
    </>
  );
};

export default ViewTaskModal;

const DeleteAction = ({ task, setIsOpen }: { task: ITask; setIsOpen: (val: null) => void }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const { error, message, success } = await deleteTaskById(task?._id);
      if (success) {
        toast.success(message);
        setIsOpen(null);
      }
      if (error) toast.error(message);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={"sm"} variant={"outline"} title="Delete">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this task and remove from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="cursor-pointer">
            {isLoading ? (
              <>
                <Spinner /> Loading...
              </>
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
