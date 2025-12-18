import { z } from "zod"

export const sprintSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date({ message: "End date is required" }),
})


export type SprintInput = z.infer<typeof sprintSchema>
