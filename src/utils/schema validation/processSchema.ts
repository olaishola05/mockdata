import { z } from "zod";

export const processSchema = z.object({
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
        processId: z
            .string()
            .min(3, { message: "Process ID must be at least 3 characters" })
            .max(100),
        assignedId: z
            .string()
            .min(3, { message: "Assigned ID must be at least 3 characters" })
            .max(100),
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
        processId: z
            .string()
            .min(3, { message: "Process ID must be at least 3 characters" })
            .max(100),
        assignedId: z
            .string()
            .min(3, { message: "Assigned ID must be at least 3 characters" })
            .max(100),
    }),

})

export const processDeleteSchema = z.object({
    body: z.object({
        processId: z
            .string()
            .min(3, { message: "Process ID must be at least 3 characters" })    
            .max(100),
    }),
})

export const processGetSchema = z.object({
    body: z.object({
        processId: z
            .string()
            .min(3, { message: "Process ID must be at least 3 characters" })
            .max(100),
    }),
})

export type ProcessSchemaType = z.infer<typeof processSchema>;
export type ProcessUpdateSchemaType = z.infer<typeof processUpdateSchema>;
export type ProcessDeleteSchemaType = z.infer<typeof processDeleteSchema>;
export type ProcessGetSchemaType = z.infer<typeof processGetSchema>;


