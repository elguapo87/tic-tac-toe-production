import jwt from "jsonwebtoken";

export const genToken = (userId: string) => {
    const secretKey = process.env.SECRET_KEY as string;
    if (!secretKey) throw new Error("SECRET_KEY is not defined or not in .env file");

    const token = jwt.sign({ userId }, secretKey);

    return token;
};