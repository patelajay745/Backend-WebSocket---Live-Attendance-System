import { ClassModel } from "@/models/class.model";
import { asyncHandler } from "@/utils/asyncHandler";
import { Request, Response } from "express";
import { ApiResponse } from "@/utils/apiResponse";
import { ApiError } from "@/utils/apiError";
import { User } from "@/models/user.model";
import mongoose from "mongoose";

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

export const addStudentToClass = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const { studentId } = req.body

    if (!id) throw new ApiError(400, "Class Id is required")

    const student = await User.findOne({ _id: new mongoose.Types.ObjectId(studentId) })

    if (!student) throw new ApiError(400, "Student not found")

    const classData = await ClassModel.findOne({ _id: new mongoose.Types.ObjectId(id), teacherId: new mongoose.Types.ObjectId(req.user?._id) })

    if (!classData) throw new ApiError(400, "Invalid classId")

    classData.studentIds.push(student._id)

    await classData.save()

    return res.status(200).json(new ApiResponse({
        _id: classData._id,
        className: classData.className,
        teacherId: classData.teacherId,
        studentId: classData.studentIds
    }))
})

export const getClassDetails = asyncHandler(async (req: Request, res: Response) => {

    const { id } = req.params

    if (!id) throw new ApiError(400, "Class id is not provided")

    const classDetails = await ClassModel.findOne({ _id: new mongoose.Types.ObjectId(id) }).populate("studentIds", "_id name email")

    if (!classDetails) throw new ApiError(404, "Class not found")

    return res.status(200).json(new ApiResponse({
        _id: classDetails._id,
        className: classDetails.className,
        teacherId: classDetails.teacherId,
        students: classDetails.studentIds
    }))
})