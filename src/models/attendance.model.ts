import mongoose, { model, ObjectId, Schema } from "mongoose";

export interface IAttendance extends Document {
    classId: ObjectId
    studentId: ObjectId
    status: "present" | "absent"
}

const attendanceSchema = new Schema({
    classId: {
        type: mongoose.Types.ObjectId,
        ref: "Class"
    },
    studentId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["present", "absent"]
    }
}, { timestamps: true })

export const Attendance = model<IAttendance>("Attendace", attendanceSchema)