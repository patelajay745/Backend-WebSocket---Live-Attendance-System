import mongoose, { Document, model, ObjectId, Schema } from "mongoose";

export interface IClass extends Document {
    className: string
    teacherId: ObjectId
    studentIds: ObjectId[]
}

const classSchema = new Schema({
    className: {
        type: String,
        trim: true
    },
    teacherId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    studentIds: {
        type: [mongoose.Types.ObjectId],
        ref: "User"
    }

}, { timestamps: true })

export const ClassModel = model<IClass>("Class", classSchema)