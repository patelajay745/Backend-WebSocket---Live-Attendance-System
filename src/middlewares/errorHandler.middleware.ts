import { ApiError } from "@/utils/apiError";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            errors: err.message
        })
    } else {
        res.status(500).json({
            success: false,
            message: err.message,
            errors: [],
        });
    }

}