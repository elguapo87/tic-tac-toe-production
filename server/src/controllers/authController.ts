import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary";
import userModel from "../models/userModel";
import bcrypt from "bcryptjs";
import { genToken } from "../lib/genToken";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, userImg } = req.body;

        if (!name || !email || !password ) return res.json({ success: false, message: "Missing Details" });

        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.json({ success: false, message: "User already exists" });

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let imgUrl = "";
        if (userImg) {
            const uploadRes = await cloudinary.uploader.upload(userImg, {
                folder: "ttt_production"
            });
            imgUrl = uploadRes.secure_url;
        }

        const user = await userModel.create({
            name,
            email, 
            password: hashedPassword,
            userImg: imgUrl
        });

        const token = genToken(user._id);

        res.json({
            success: true,
            message: "User created",
            token,
            userData: {
                _id: user._id,
                name,
                email,
                userImg
            }
        });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.json({ success: false, message: errMessage });
    }
};