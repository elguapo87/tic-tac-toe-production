import express from "express";
import { chechAuth, getUsers, login, register } from "../controllers/authController";
import { protectRoute } from "../middleware/authUser";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check", protectRoute, chechAuth);
router.get("/get-users", protectRoute, getUsers);

export default router;