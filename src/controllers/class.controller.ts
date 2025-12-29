import { ClassModel } from "@/models/class.model";
import { asyncHandler } from "@/utils/asyncHandler";
import { Request, Response } from "express";
import { ApiResponse } from "@/utils/apiResponse";

export const createClass = asyncHandler(async (req: Request, res: Response) => {
    const { className } = req.body

    const teacherId = req.user?._id

    const createdClass = await ClassModel.create({
        className,
        teacherId
    })

    return res.status(201).json(new ApiResponse({
        _id: createdClass._id,
        className: createdClass.className,
        teacherId: createdClass.teacherId,
        studentIds: createdClass.studentIds
    }))
})