"use client";
import { Button } from "@/components/ui/button";
import { IProject, ISprint } from "@/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SprintInput, sprintSchema } from "@/validators/sprint-schema";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import DatePicker from "@/components/ui/date-picker";
import { addSprintByProjectId, updateSprintById } from "@/fetch-api/sprint";

const AddSprint = ({ project }: { project: IProject }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="size-5" /> Add Sprint
      </Button>
      <SprintFormModal type="create" isOpen={isOpen} setIsOpen={setIsOpen} project={project} />
    </div>
  );
};

export default AddSprint;

interface SprintFormModalProps {
  type: "create" | "update";
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  project?: IProject;
  sprint?: ISprint;
}
export const SprintFormModal = ({ type, isOpen, setIsOpen, project, sprint }: SprintFormModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isUpdate = type === "update";

  const methods = useForm<SprintInput>({ resolver: zodResolver(sprintSchema) });
  const { handleSubmit, control, watch, reset } = methods;

  useEffect(() => {
    if (!sprint) return;
    reset({
      title: sprint?.title || "",
      endDate: sprint?.endDate ? new Date(sprint?.endDate) : undefined,
      startDate: sprint?.startDate ? new Date(sprint?.startDate) : undefined,
    });
  }, [sprint, reset]);

  const closeModal = (bool: boolean) => {
    setIsOpen(bool);
    if (!bool) reset();
  };

  // <!-- Handle Submit -->
  const onSubmit: SubmitHandler<SprintInput> = async (data) => {
    try {
      setIsLoading(true);
      const { error, message, success } = isUpdate
        ? await updateSprintById(sprint?._id, data)
        : await addSprintByProjectId(project?._id, data);

      if (success) {
        closeModal(false);
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
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:p-7 max-sm:pb-10 max-w-xl! max-h-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{isUpdate ? "Edit Sprint" : "Add Sprint"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-4">
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor={field.name}>Title *</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter sprint title"
                    className="h-11"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="startDate"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor={field.name}>Start Date *</FieldLabel>
                  <DatePicker date={field.value} setDate={(date) => field.onChange(date)} className="h-11" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="endDate"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor={field.name}>End Date *</FieldLabel>
                  <DatePicker
                    date={field.value}
                    startMonth={watch("startDate")}
                    setDate={(date) => field.onChange(date)}
                    className="h-11"
                  />
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
            ) : isUpdate ? (
              "Save Changes"
            ) : (
              "Add Sprint"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
