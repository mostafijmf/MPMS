"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LoginInput, loginSchema } from "@/validators/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import { login } from "@/fetch-api/auth";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      isRemember: false,
    },
  });
  const { handleSubmit, control, setError } = methods;

  // <!-- Handle Submit -->
  const onSubmit: SubmitHandler<LoginInput> = async (formData) => {
    try {
      setIsLoading(true);
      const { data, error, message, success } = await login(formData);

      if (success) {
        toast.success(data?.message);
        router.push("/dashboard");
      }
      if (error) {
        const inputError = data?.inputError;
        if (inputError) setError(inputError?.email ? "email" : "password", { message: data?.message });
        else toast.error(message);
      }
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
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
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
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
      </div>

      <Controller
        name="isRemember"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox id={field.name} checked={field.value} onCheckedChange={field.onChange} />
            <Label htmlFor={field.name} className="text-base font-normal cursor-pointer">
              Remember me
            </Label>
          </div>
        )}
      />

      <Button type="submit" size={"lg"} className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Spinner /> Loading...
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
