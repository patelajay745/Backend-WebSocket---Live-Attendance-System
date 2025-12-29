import z from "zod";

export const createClassSchema = z.object({
    className: z.string().min(1, "Classname is required")
})

export const addStudentSchema = z.object({
    studentId: z.string().min(1, "student id is required")
})