"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Plus } from "lucide-react";
import { TaskInput, taskSchema } from "@/validators/task-schema";
import DatePicker from "@/components/ui/date-picker";
import SelectMembers from "../select-members";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MediaField from "../media-field";
import { Textarea } from "@/components/ui/textarea";
import { initializeFormData } from "@/lib/utils";
import { addTaskBySprintProjectIds } from "@/fetch-api/task";
import { ITask } from "@/types";

interface AddTaskModalProps {
  state: { projectId: string; sprintId: string; status: ITask["status"] } | null;
  onClose: () => void;
}
const AddFormModal = ({ state, onClose }: AddTaskModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<TaskInput>({ resolver: zodResolver(taskSchema) });
  const { handleSubmit, control, reset } = methods;

  useEffect(() => {
    if (!state) return;
    reset({ title: "", description: "", status: state.status });
  }, [state, reset]);

  const closeModal = () => {
    onClose();
    reset();
  };

  // <!-- Handle Submit -->
  const onSubmit: SubmitHandler<TaskInput> = async (data) => {
    try {
      setIsLoading(true);
      const formData = initializeFormData(data);
      const { error, message, success } = await addTaskBySprintProjectIds({
        projectId: state?.projectId as string,
        sprintId: state?.sprintId as string,
        body: formData,
      });

      if (success) {
        closeModal();
        toast.success(message);
      }
      if (error) toast.error(message);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={state ? true : false} onOpenChange={closeModal}>
      <DialogContent className="sm:p-7 max-sm:pb-10 max-w-4xl! max-h-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1 col-span-2">
                  <FieldLabel htmlFor={field.name}>Title *</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter task title"
                    className="h-11"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1 col-span-2">
                  <FieldLabel htmlFor={field.name}>Description *</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Enter task description"
                    rows={6}
                    className="min-h-20"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="estimateHours"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1 md:col-span-1 col-span-2">
                  <FieldLabel htmlFor={field.name}>Estimate Hours</FieldLabel>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    id={field.name}
                    type="number"
                    min="0"
                    placeholder="Enter estimate hours"
                    className="h-11"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="dueDate"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor={field.name}>Due Date</FieldLabel>
                  <DatePicker date={field.value} setDate={(date) => field.onChange(date)} className="h-11" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1 md:col-span-1 col-span-2">
                  <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full h-11!">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To do</SelectItem>
                      <SelectItem value="in_progress">In progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="priority"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1 md:col-span-1 col-span-2">
                  <FieldLabel htmlFor={field.name}>Priority</FieldLabel>
                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full h-11!">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="assigns"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1 col-span-2">
                  <FieldLabel htmlFor={field.name}>Assign</FieldLabel>
                  <SelectMembers onChange={(val) => field?.onChange(val?.map((data) => data?._id))} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="attachments"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1 col-span-2">
                  <FieldLabel htmlFor={field.name}>Attachments</FieldLabel>
                  <MediaField accept="/*" value={field.value} onChange={(file) => field.onChange(file)} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Button type="submit" size={"lg"} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner /> Loading...
              </>
            ) : (
              <>
                <Plus className="size-5" /> Add Task
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFormModal;
