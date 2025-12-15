import { z } from "zod"

const MAX_FILE_SIZE = 600 * 1024 // 600 KB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]

const baseUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  avatar: z
    .custom<File | undefined>()
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, "Avatar must be less than 600 KB")
    .refine((file) => !file || ALLOWED_TYPES.includes(file.type), "Only JPG, PNG, WEBP or AVIF allowed"),
  skills: z.array(z.string()).optional(),
  department: z.string().optional(),
})

export const userSchema = baseUserSchema
  .extend({
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password should be at least 6 characters" }),
    confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords didn't match",
    path: ["confirmPassword"],
  })

export const updateUserSchema = baseUserSchema
  .extend({
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword
      }
      return true
    },
    {
      message: "Passwords didn't match",
      path: ["confirmPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password.length >= 6
      }
      return true
    },
    {
      message: "Password should be at least 6 characters",
      path: ["password"],
    },
  )

export type UserInput = z.infer<typeof userSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
