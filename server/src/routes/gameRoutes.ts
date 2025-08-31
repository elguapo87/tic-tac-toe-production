import express from "express";
import { protectRoute } from "../middleware/authUser";
import { makeMove, quitGame, resetGame, startGame } from "../controllers/gameController";

const router = express.Router();

router.post("/make-move/:gameId", protectRoute, makeMove);
router.post("/start", protectRoute, startGame);
router.post("/quit", protectRoute, quitGame);
router.post("/reset/:gameId", protectRoute, resetGame);

export default router;