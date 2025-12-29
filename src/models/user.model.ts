import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    role: "teacher" | "student"
}

const userSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ["teacher", "student"],
        default: "student"
    }
}, { timestamps: true })

export const User = model<IUser>("User", userSchema)