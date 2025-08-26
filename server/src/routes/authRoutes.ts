import express from "express";
import { chechAuth, login, register } from "../controllers/authController";
import { protectRoute } from "../middleware/authUser";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check", protectRoute, chechAuth);

export default router;