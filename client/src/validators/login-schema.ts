import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password should be at least 6 characters" }),
  isRemember: z.boolean(),
});

export type LoginInput = z.infer<typeof loginSchema>;
