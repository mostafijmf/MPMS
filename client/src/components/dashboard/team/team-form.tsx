"use client";
import { Button } from "@/components/ui/button";
import { Camera, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input, PasswordInput } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { UpdateUserInput, updateUserSchema, UserInput, userSchema } from "@/validators/user-schema";
import { createUser, updateUserById } from "@/fetch-api/user";
import { toast } from "sonner";
import Image from "next/image";
import { SkillsInput } from "./skills-input";
import { IUser } from "@/types";

const TeamForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        <UserPlus className="size-5" /> Add Member
      </Button>
      <TeamFormModal type="create" isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default TeamForm;

interface TeamFormModalProps {
  type: "create" | "update";
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  user?: IUser;
}
export const TeamFormModal = ({ type, isOpen, setIsOpen, user }: TeamFormModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isUpdate = type === "update";

  const methods = useForm<UserInput | UpdateUserInput>({
    resolver: zodResolver(isUpdate ? updateUserSchema : userSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
      department: user?.department || "",
      skills: user?.skills || [],
    },
  });
  const { handleSubmit, control, watch, reset } = methods;
  const previewAvatar = watch("avatar") || user?.avatar;

  const closeModal = (bool: boolean) => {
    setIsOpen(bool);
    if (!bool) reset();
  };

  // <!-- Handle Submit -->
  const onSubmit: SubmitHandler<UserInput | UpdateUserInput> = async (data) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data?.password) formData.append("password", data.password);
      if (data?.avatar) formData.append("avatar", data.avatar);
      if (data?.department) formData.append("department", data.department);
      if (data?.skills && data.skills.length > 0) {
        data?.skills.forEach((skill) => {
          formData.append("skills[]", skill);
        });
      }

      const { error, message, success } = isUpdate
        ? await updateUserById(user?._id as string, formData)
        : await createUser(formData);

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
      <DialogContent className="p-7 max-w-xl!">
        <DialogHeader>
          <DialogTitle className="text-2xl">{isUpdate ? "Edit Member" : "Add Member"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <Controller
              name="avatar"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <div className="flex justify-center">
                    <div
                      className="size-39 rounded-full bg-primary/10 cursor-pointer border overflow-hidden hover:bg-black/50 group/avatar transition grid place-items-center"
                      onClick={() => document.getElementById("avatar")?.click()}
                    >
                      {previewAvatar ? (
                        <div className="size-full relative">
                          <Image
                            src={typeof previewAvatar === "string" ? previewAvatar : URL.createObjectURL(previewAvatar)}
                            alt="Avatar"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 grid place-items-center opacity-0 group-hover/avatar:opacity-100 group-hover/avatar:bg-black/50 transition">
                            <Camera strokeWidth={1.5} className="size-13 text-white" />
                          </div>
                        </div>
                      ) : (
                        <Camera strokeWidth={1.5} className="size-13 group-hover/avatar:text-white transition" />
                      )}
                      <Input
                        type="file"
                        id="avatar"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                      />
                    </div>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor={field.name}>Name *</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter full name"
                      className="h-11"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor={field.name}>Email address *</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="john@example.com"
                      className="h-11"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor={field.name}>Password {!isUpdate && "*"}</FieldLabel>
                    <PasswordInput
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your password"
                      className="h-11"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor={field.name}>Confirm Password {!isUpdate && "*"}</FieldLabel>
                    <PasswordInput
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter confirm password"
                      className="h-11"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="department"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1 col-span-2">
                    <FieldLabel htmlFor={field.name}>Department</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter department"
                      className="h-11"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="skills"
                control={control}
                render={({ field, fieldState }) => (
                  <SkillsInput
                    value={field.value || []}
                    onChange={field.onChange}
                    invalid={fieldState.invalid}
                    error={fieldState.error}
                  />
                )}
              />
            </div>
          </div>

          <Button type="submit" size={"lg"} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner /> Loading...
              </>
            ) : isUpdate ? (
              "Update"
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
