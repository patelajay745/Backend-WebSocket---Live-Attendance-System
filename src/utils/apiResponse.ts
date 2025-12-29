
export class ApiResponse {
    data: object
    success: boolean

    constructor(data: {} = {}) {
        this.success = true
        this.data = data
    }
}