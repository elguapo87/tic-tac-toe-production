import mongoose, { mongo } from "mongoose";

const gameSchema = new mongoose.Schema({
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        }
    ],
    board: {
        type: [String],
        default: Array(9).fill(null)
    },
    xPlaying: {
        type: Boolean,
        default: true
    },
    winner: {
        type: String,
        default: null
    },
    isOver: {
        type: Boolean,
        default: false
    },
    winningLine: {
        type: [Number],
        default: null
    }
}, { timestamps: true });

const gameModel = mongoose.models.game || mongoose.model("game", gameSchema);

export default gameModel