import express from "express";
import { protectRoute } from "../middleware/authUser";
import { makeMove, quitGame, startGame } from "../controllers/gameController";

const router = express.Router();

router.post("/make-move/:gameId", protectRoute, makeMove);
router.post("/start", protectRoute, startGame);
router.post("/quit", protectRoute, quitGame);

export default router;