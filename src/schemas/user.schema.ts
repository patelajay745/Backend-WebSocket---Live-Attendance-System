import z from "zod";

export const createUserSchema = z.object({
    name: z.string().min(1, "name is required"),
    email: z.email().min(1, "email is required"),
    password: z.string().min(6, "password should be min. 6 characters long."),
    role: z.enum(["teacher", "student"])
})