import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel, { UserDocument } from "../models/userModel";

interface AuthenticatedRequest extends Request {
    user?: UserDocument;
};

export const protectRoute = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.token as string;
        if (!token) return res.status(401).json({ success: false, message: "Unauthorized: No token" });

        const secretKey = process.env.SECRET_KEY as string;
        if (!secretKey) return res.status(500).json({ success: false, message: "Missing SECRET_KEY" });

        const decoded = jwt.verify(token, secretKey) as { userId: string };

        const user = await userModel.findById(decoded.userId).select("-password");
        if (!user) {
            res.status(401).json({ success: false, message: "Unauthorized: Invalid user" });
        }

        req.user = user;

        next();

    } catch (error) {
        console.error("protectRoute error:", error);
        res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};