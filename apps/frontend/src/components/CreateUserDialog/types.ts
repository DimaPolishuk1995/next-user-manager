import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string({ required_error: "Name must not be empty" }).min(1, "Name must not be empty").max(100, "Name is too long (100)"),
    email: z.string({ required_error: "Email must not be empty" }).email("Email must be valid").max(120, "Email is too long (120)"),
    createdAt: z.string(),
});
export type CreateUserFormValues = z.infer<typeof createUserSchema>;
