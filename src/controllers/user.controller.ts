import { asyncHandler } from "@/utils/asyncHandler";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { User } from "@/models/user.model";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body

    const alreadyUser = await User.findOne({ email })

    if (alreadyUser) throw new ApiError(400, "Email already exists")

    const hasedPassword = await bcrypt.hash(password, 8)

    const createdUser = await User.create({
        name, email, password: hasedPassword, role
    })

    return res.status(201).json(new ApiResponse({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role
    }))
})