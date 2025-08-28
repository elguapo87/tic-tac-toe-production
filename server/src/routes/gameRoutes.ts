import express from "express";
import { protectRoute } from "../middleware/authUser";
import { makeMove, startGame } from "../controllers/gameController";

const router = express.Router();

router.post("/make-move/:gameId", protectRoute, makeMove);
router.post("/start", protectRoute, startGame);

export default router;