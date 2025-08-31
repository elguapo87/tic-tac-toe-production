import express from "express";
import { protectRoute } from "../middleware/authUser";
import { getHistory, makeMove, quitGame, resetGame, startGame } from "../controllers/gameController";

const router = express.Router();

router.post("/make-move/:gameId", protectRoute, makeMove);
router.post("/start", protectRoute, startGame);
router.post("/quit", protectRoute, quitGame);
router.post("/reset/:gameId", protectRoute, resetGame);
router.get("/history/:user1Id/:user2Id", protectRoute, getHistory);

export default router;