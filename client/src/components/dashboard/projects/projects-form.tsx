"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DatePicker from "@/components/ui/date-picker";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { IProject } from "@/types";
import { ProjectInput, projectSchema } from "@/validators/project-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import MediaField from "./media-field";
import { useRouter } from "next/navigation";
import { initializeFormData } from "@/lib/utils";
import { createProject, updateProjectById } from "@/fetch-api/project";

interface ProjectsFormProps {
  type: "create" | "update";
  project?: IProject;
}
const ProjectsForm = ({ type, project }: ProjectsFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isUpdate = type === "update";

  const methods = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      budget: Number(project?.budget) || 0,
      client: project?.client || "",
      description: project?.description || "",
      endDate: project?.endDate ? new Date(project?.endDate) : undefined,
      startDate: project?.startDate ? new Date(project?.startDate) : undefined,
      status: project?.status,
      thumbnail: (project?.thumbnail as string) || undefined,
    },
  });
  const { handleSubmit, control, watch, reset } = methods;

  // <!-- Handle Submit -->
  const onSubmit: SubmitHandler<ProjectInput> = async (data) => {
    try {
      setIsLoading(true);
      const formData = initializeFormData(data);
      const { error, message, success } =
        type === "update" ? await updateProjectById(project?._id, formData) : await createProject(formData);
      if (success) {
        toast.success(message);
        reset();
        router.push("/dashboard/projects");
      }
      if (error) toast.error(message);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto sm:mt-10 mb-20 gap-2 max-sm:border-none max-sm:shadow-none">
      <CardHeader className="max-sm:p-0">
        <CardTitle className="text-2xl">Create Project</CardTitle>
      </CardHeader>
      <CardContent className="max-sm:p-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1 col-span-2">
                  <FieldLabel htmlFor={field.name}>Project Title *</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter project title"
                    className="h-11"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="client"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1 col-span-2">
                  <FieldLabel htmlFor={field.name}>Client *</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter project title"
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
                <Field data-invalid={fieldState.invalid} className="gap-1 md:col-span-1 col-span-2">
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
                <Field data-invalid={fieldState.invalid} className="gap-1 md:col-span-1 col-span-2">
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

            <Controller
              name="budget"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1 md:col-span-1 col-span-2">
                  <FieldLabel htmlFor={field.name}>Budget</FieldLabel>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    id={field.name}
                    type="number"
                    min="0"
                    placeholder="$0.00"
                    className="h-11"
                  />
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
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger className="w-full h-11!">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
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
                    placeholder="Enter project description"
                    rows={6}
                    className="min-h-24"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="thumbnail"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1 col-span-2">
                  <FieldLabel htmlFor={field.name}>Thumbnail</FieldLabel>
                  <MediaField value={field.value} onChange={(file) => field.onChange(file)} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" size={"lg"} variant={"outline"} className="px-10" onClick={() => router.back()}>
              Back
            </Button>
            <Button type="submit" size={"lg"} disabled={isLoading} className="px-10">
              {isLoading ? (
                <>
                  <Spinner /> Loading...
                </>
              ) : isUpdate ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectsForm;
