import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary";
import userModel, { UserDocument } from "../models/userModel";
import bcrypt from "bcryptjs";
import { genToken } from "../lib/genToken";

interface AuthenticatedRequest extends Request {
    user?: UserDocument;
};

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
            userData: {
                _id: user._id,
                name: user.name,
                email: user.email,
                userImg: user.userImg
            },
            token
        });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.json({ success: false, message: errMessage });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (!existingUser) return res.json({ success: false, message: "User not exists" });

        const matchPassword = await bcrypt.compare(password, existingUser.password);    
        if (!matchPassword) return res.json({ success: false, message: "Wrong Credentials" });
        
        const userData = {
            _id: existingUser._id,
            name: existingUser.name,    
            email: existingUser.email,
            userImg: existingUser.userImg
        };
        
        const token = genToken(existingUser._id);

        res.json({
            success: true, 
            message: "You are logged in",
            userData,
            token
        });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.json({ success: false, message: errMessage });
    }
};

export const chechAuth = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ success: false, message: "Unauthorized" })
        
        res.status(200).json({ success: true, user });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ success: false, message: errMessage });
    }
};

export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?._id;

        const filteredUsers = await userModel.find({_id: { $ne: userId } }).select("-password");

        res.json({ success: true, filteredUsers });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ success: false, message: errMessage });
    }
};