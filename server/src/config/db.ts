import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("Connected", () => {
            console.log("Database Connected");
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/ttt_production`);

    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
};

export default connectDB;