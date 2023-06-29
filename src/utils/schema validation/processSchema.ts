import { z } from "zod";

export const processSchema = z.object({
    body: z.object({
        id: z
            .string(),
            // .optional(),
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
        assignee: z
            .string()
            .min(3, { message: "Assigned ID must be at least 3 characters" })
            .max(100),
            
        assigneeId: z
            .string()
            .min(3, { message: "Assigned ID must be at least 3 characters" })
            .max(100),
        createdAt: z
            .date(),
        updatedAt: z
            .date(),
    }),
})

export const processUpdateSchema = z.object({
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
        assignedId: z
            .string()
            .min(3, { message: "Assigned ID must be at least 3 characters" })
            .max(100),
    }),

})


export type ProcessSchemaType = z.infer<typeof processSchema>;
export type ProcessUpdateSchemaType = z.infer<typeof processUpdateSchema>;



