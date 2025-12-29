import { User } from "@/models/user.model";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { Request, Response } from "express";

export const getAllStudents = asyncHandler(async (req: Request, res: Response) => {

    const students = await User.find({ role: "student" }).select("_id name email")

    if (students.length == 0) {
        throw new ApiError(404, "students not found")
    }

    return res.status(200).json(new ApiResponse(students))
})