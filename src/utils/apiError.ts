
export class ApiError extends Error {
    error: string[]

    constructor(error = [], message?: "", stack = "") {
        super(message)

        this.error = error

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}