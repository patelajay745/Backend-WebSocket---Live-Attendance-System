
export class ApiError extends Error {
    error: string
    success: boolean
    statusCode: number

    constructor(statusCode: number = 500, message: string = "", stack = "") {
        super(message)

        this.success = false
        this.error = message
        this.statusCode = statusCode

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}