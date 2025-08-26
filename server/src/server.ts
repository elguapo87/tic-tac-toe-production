import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";

const app = express();
const server = http.createServer(app);

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

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        server.listen(PORT, () => {
            console.log(`Server is running on PORT: ${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
};

startServer();
