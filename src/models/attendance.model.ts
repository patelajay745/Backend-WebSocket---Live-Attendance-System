import mongoose, { Document, model, Schema, Types } from "mongoose";

export interface IAttendance extends Document {
    classId: Types.ObjectId
    studentId: Types.ObjectId
    status: "present" | "absent"
}

const attendanceSchema = new Schema<IAttendance>({
    classId: {
        type: Schema.Types.ObjectId,
        ref: "Class"
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["present", "absent"]
    }
}, { timestamps: true })

export const Attendance = model<IAttendance>("Attendace", attendanceSchema)