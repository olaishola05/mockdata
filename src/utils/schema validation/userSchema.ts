import { z } from "zod";

export const createUserSchema = z.object({
    body: z.object({
        firsName: z
            .string()
            .min(3, { message: "First name must be at least 3 characters" })
            .max(100),
        lastName: z
            .string()
            .min(2, { message: "Last name must be at least 3 characters" })
            .max(100),
        email: z
            .string()
            .min(1, { message: "Email is required" })
            .email("Invalid email address"),
        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters" })
            .max(100),
        confirmPassword: z
            .string()
            .min(6, { message: "Password must be at least 6 characters" })
            .max(100),
        role: z.enum(["user", "admin"]).optional(),
        workspace: z.string().optional(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }),
})

export const loginSchema = z.object({
    body: z.object({
        email: z
            .string()
            .min(1, { message: "Email is required" })
            .email("Invalid email address"),
        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters" })
            .max(100),
    }),
});

export const passwordResetSchema = z.object({
    body: z.object({
        email: z
            .string()
            .min(1, { message: "Email is required" })
            .email("Invalid email address"),
    }),
});

export const passwordResetTokenSchema = z.object({
    body: z.object({
        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters" })
            .max(100),
        confirmPassword: z
            .string()
            .min(6, { message: "Password must be at least 6 characters" })
            .max(100),
    }),
});

export const updateUserSchema = z.object({
    body: z.object({
        firsName: z
            .string()
            .min(3, { message: "First name must be at least 3 characters" })
            .max(100),
        lastName: z
            .string()
            .min(2, { message: "Last name must be at least 3 characters" })
            .max(100),
        email: z
            .string()
            .min(1, { message: "Email is required" })
            .email("Invalid email address"),
        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters" })
            .max(100),
        workspace: z.string().optional(),
    }),
});


export type loginSchemaType = z.infer<typeof loginSchema>;
export type passwordResetTokenSchemaType = z.infer<typeof passwordResetTokenSchema>;
export type passwordResetSchemaType = z.infer<typeof passwordResetSchema>;
export type createUserSchemaType = z.infer<typeof createUserSchema>;

