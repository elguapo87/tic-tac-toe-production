import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import { registerSocketServer } from "./lib/socket";
import { Server as SocketIOServer } from "socket.io";
import { setIO } from "./lib/socketServer";

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
    cors: {
        origin: "*"
    }
});

setIO(io);

// Register socket handlers 
registerSocketServer(io);

// Middleware setup
app.use(express.json({ limit: "4mb" }));
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
};
app.use(cors(corsOptions));

app.use("/api/status", (req, res) => {
    res.send("Server is live");
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        
        server.listen(PORT, () => {
            console.log(`Server + Socket.IO running on PORT: ${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
};

startServer();
