import { z } from "zod"

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"];

const existingAttachmentSchema = z.object({
  filename: z.string(),
  url: z.url(),
  size: z.number(),
});

const fileSchema = z
  .instanceof(File)
  .refine((file) => ALLOWED_TYPES.includes(file.type), {
    message: "Only JPG, PNG, PDF, WEBP or AVIF file allowed",
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "Attachments must be less than 1 MB",
  });

export const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description cannot exceed 5000 characters" }),
  assigns: z.array(z.any()).optional(),
  estimateHours: z
    .number()
    .min(0, "Estimate hours cannot be negative")
    .optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["todo", "in_progress", "review", "done"]),
  dueDate: z.date().optional(),
  attachments: z
    .union([fileSchema, z.array(existingAttachmentSchema)])
    .optional(),
})


export type TaskInput = z.infer<typeof taskSchema>
