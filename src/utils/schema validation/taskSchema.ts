import { z } from "zod";

export const taskSchema = z.object({
    body: z.object({
        firstName: z
            .string()
            .min(3, { message: "Full name must be at least 3 characters" })
            .max(100),
        lastName: z
            .string()
            .min(3, { message: "Last name must be at least 3 characters" })
            .max(100),
        phone: z
            .string()
            .min(3, { message: "Phone must be at least 3 characters" })
            .max(16),
        description: z
            .string()
            .min(3, { message: "Description must be at least 3 characters" })
            .max(1000),
    }),
})

export const taskUpdateSchema = z.object({
    body: z.object({
        fullName: z
            .string()
            .min(3, { message: "Full name must be at least 3 characters" })
            .max(100),
        lastName: z
            .string()
            .min(3, { message: "Last name must be at least 3 characters" })
            .max(100),
        phone: z
            .string()
            .min(3, { message: "Phone must be at least 3 characters" })
            .max(16),
        description: z
            .string()
            .min(3, { message: "Description must be at least 3 characters" })
            .max(1000),
    }),

})


export type taskSchemaType = z.infer<typeof taskSchema>;
export type taskUpdateSchemaType = z.infer<typeof taskUpdateSchema>;



