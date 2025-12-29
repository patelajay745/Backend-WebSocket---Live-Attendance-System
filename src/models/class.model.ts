import mongoose, { Document, model, Schema, Types } from "mongoose";

export interface IClass extends Document {
    className: string
    teacherId: Types.ObjectId
    studentIds: Types.ObjectId[]
}

const classSchema = new Schema<IClass>({
    className: {
        type: String,
        trim: true
    },
    teacherId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    studentIds: {
        type: [Schema.Types.ObjectId],
        ref: "User"
    }

}, { timestamps: true })

export const ClassModel = model<IClass>("Class", classSchema)