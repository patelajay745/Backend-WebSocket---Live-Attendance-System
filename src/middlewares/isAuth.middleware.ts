import { config } from "@/config";
import { IUser, User } from "@/models/user.model";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const isAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.headers?.authorization?.split(' ')[1];

    if (!token) throw new ApiError(400, "Token is not provided")

    const decoded = jwt.verify(token, config.JWT_TOKEN_SECRET!) as {
        userId: string,
        role: string
    }

    const user = await User.findOne({ _id: decoded.userId })

    if (!user) throw new ApiError(400, "Invalid Token")

    req.user = user

    next()
})

export const isTeacher = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const role = req.user!.role

    if (role !== "teacher") throw new ApiError(403, "UnAuthrorized request")

    next()
})