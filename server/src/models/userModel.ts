import mongoose, { Document } from "mongoose";

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    userImg: string;
    createdAt: Date;
    updatedAt: Date;
};

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    userImg: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;