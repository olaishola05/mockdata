import { z } from "zod";


export const processSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(3, { message: "Name must be at least 3 characters" })
      .max(100),
    color: z
      .string()
      .trim()
      .min(3, { message: "Color must be at least 3 characters" })
      .max(100),
    icon: z
      .string()
      .trim()
      .min(3, { message: "Icon must be at least 3 characters" })
      .max(100),
  }),
})


export type processSchemaType = z.infer<typeof processSchema>;