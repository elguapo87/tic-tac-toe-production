import express from "express";
import { protectRoute } from "../middleware/authUser";
import { makeMove } from "../controllers/gameController";

const router = express.Router();

router.post("/make-move/:gameId", protectRoute, makeMove);

export default router;