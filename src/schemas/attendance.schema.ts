import z from "zod";

export const startClassSchema = z.object({
    classId: z.string().min(1, "classId is required")
})