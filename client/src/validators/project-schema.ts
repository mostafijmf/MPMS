import { z } from "zod"

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export const projectSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  client: z.string().min(1, { message: "Client is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  thumbnail: z
    .custom<File | string | undefined>()
    .optional()
    .refine((file) => !file || typeof file === "string" || file.size <= MAX_FILE_SIZE, "Thumbnail must be less than 1 MB")
    .refine((file) => !file || typeof file === "string" || ALLOWED_TYPES.includes(file.type), "Only JPG, PNG, WEBP or AVIF allowed"),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date({ message: "End date is required" }),
  status: z.enum(["planned", "active", "completed", "archived"]).optional(),
  budget: z
    .number()
    .min(0, "Budget cannot be negative")
    .optional(),
})


export type ProjectInput = z.infer<typeof projectSchema>
