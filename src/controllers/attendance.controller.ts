import { ClassModel } from "@/models/class.model";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { ApiResponse } from "@/utils/apiResponse";

let activeSession: {
    classId: string;
    startedAt: string;
    attendace: Object;
} | null = null;

export const getActiveSession = () => activeSession;

export const clearActiveSession = () => {
    activeSession = null;
}

export const startSession = asyncHandler(async (req: Request, res: Response) => {

    const { classId } = req.body

    if (activeSession) {
        throw new ApiError(400, `An attendance session is already active for class ${activeSession.classId}. Please end the current session first.`)
    }

    const classDetails = await ClassModel.findOne({
        _id: new mongoose.Types.ObjectId(classId),
        teacherId: new mongoose.Types.ObjectId(req.user?._id)
    })

    if (!classDetails) throw new ApiError(400, "Class not found or you are not authorized to start a session for this class")

    activeSession = {
        classId: classDetails._id.toString(),
        startedAt: new Date().toISOString(),
        attendace: {}
    }

    return res.status(200).json(new ApiResponse({
        classId: classDetails._id,
        startedAt: activeSession.startedAt
    }))
})

