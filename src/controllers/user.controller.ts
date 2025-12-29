import { asyncHandler } from "@/utils/asyncHandler";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { User } from "@/models/user.model";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import jwt from "jsonwebtoken"
import { config } from "@/config";

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

export const getLogin = asyncHandler(async (req: Request, res: Response) => {

    const { password, email } = req.body

    const user = await User.findOne({ email })

    if (!user) throw new ApiError(400, "Invalid Email")

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) throw new ApiError(400, "Invalid Email or password")

    const token = await jwt.sign({
        userId: user._id,
        role: user.role
    },
        config.JWT_TOKEN_SECRET!,
        { expiresIn: "1d" }
    )

    if (!token) throw new ApiError(500, "Something went wrong")

    return res.status(200).json(new ApiResponse({ token }))
})

export const userDetails = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json(new ApiResponse({
        _id: req.user?._id,
        name: req.user?.name,
        email: req.user?.email,
        role: req.user?.role
    }))
})