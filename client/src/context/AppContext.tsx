import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { io, type Socket } from "socket.io-client";

export type UserData = {
    _id: string;
    name: string;
    email: string;
    userImg: string;
    inGame: boolean;
};

type GameData = {
    _id: string;
    players: string[];       // [playerXId, playerOId]
    board: (string | null)[];
    xPlaying: boolean;
    winner: "X" | "O" | "draw" | null;
    isOver: boolean;
    opponentId?: string;
    winningLine: [number] | null;
};

type HistoryData = {
    total: number;
    draws: number;
    user1Wins: number;
    user2Wins: number;
    recent: any[];
};


interface AppContextType {
    socket: Socket | null;
    setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
    authUser: UserData | null;
    setAuthUser: React.Dispatch<React.SetStateAction<UserData | null>>;
    login: (state: "Login" | "Sign Up", credentials: Partial<UserData> & { password: string }) => Promise<void>;
    logout: () => Promise<void>;
    users: UserData[];
    setUsers: React.Dispatch<React.SetStateAction<UserData[]>>;
    getUsers: () => Promise<void>;
    onlineUsers: string[];
    setOnlineUsers: React.Dispatch<React.SetStateAction<string[]>>;
    selectedUser: UserData | null;
    setSelectedUser: React.Dispatch<React.SetStateAction<UserData | null>>;
    game: GameData | null;
    setGame: React.Dispatch<React.SetStateAction<GameData | null>>;
    makeMove: (gameId: string, boxIndex: number) => Promise<void>;
    startGame: (opponentId: string) => Promise<void>;
    quitGame: () => Promise<void>;
    resetGame: (gameId: string) => Promise<void>;
    history: HistoryData | null;
    setHistory: React.Dispatch<React.SetStateAction<HistoryData | null>>;
    getHistory: (user1Id: string, user2Id: string) => Promise<void>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

    const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : null);
    const [authUser, setAuthUser] = useState<UserData | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [users, setUsers] = useState<UserData[]>([]);

    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [game, setGame] = useState<GameData | null>(null);
    const [history, setHistory] = useState<HistoryData | null>(null);

    const navigate = useNavigate();

    // Function to check if user is authenticated and if so, set the user data and connect the socketto check user auth
    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check", {
                headers: { token }
            });

            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);

            } else {
                logout();
            }

        } catch (error) {
            console.error("checkAuth failed", error);
        }
    };

    // Login function to handle user authentication and socket connection
    const login = async (state: "Login" | "Sign Up", credentials: Partial<UserData> & { password: string }) => {
        try {
            const endpoint = state === "Sign Up" ? "register" : "login";

            const { data } = await axios.post(`/api/auth/${endpoint}`, credentials);

            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);
        }
    };

    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        setGame(null);
        socket?.disconnect();
        toast.success("Logged out successfully");
    };

    const quitGame = async () => {
        try {
            const { data } = await axios.post("/api/game/quit", {}, {
                headers: { token }
            });

            if (data.success) {
                toast.success(data.message);
                navigate("/lobby");

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    // Conncect socket function to handle socket connection and online users update
    const connectSocket = (userData: { _id: string }) => {
        if (!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id
            }
        });
        // newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });

        // useEffect-like listener for game updates 
        newSocket.on("gameUpdated", (updatedGame: GameData) => {
            console.log("Game Updated", updatedGame);
            setGame(updatedGame);
        });

        newSocket.on("gameStarted", ({ game, message }) => {
            const normalizedGame = {
                ...game,
                players: game.players.map((p: any) =>
                    typeof p === "string" ? p : p._id
                )
            };

            setGame(normalizedGame);

            // set opponent (the other player)
            const opponentId = normalizedGame.players.find((id: string) => id !== userData._id);
            const opponent = users.find((user) => user._id === opponentId) || null;
            setSelectedUser(opponent);

            if (message) {
                toast.success(message);
            }

            navigate("/online")
        });

        newSocket.on("usersUpdated", (updatedUsers: UserData[]) => {
            setUsers(updatedUsers);
        });

        newSocket.on("gameEnded", ({ message }) => {
            toast.error(message || "Game ended");
            setGame(null);
            setSelectedUser(null);
            navigate("/lobby"); 
        });
    };

    // Function to get all users in OnlineLobby page
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/auth/get-users", {
                headers: { token }
            });

            if (data.success) {
                setUsers(data.filteredUsers);

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);
        }
    };

    const startGame = async (opponentId: string) => {
        try {
            const { data } = await axios.post("/api/game/start", { opponentId }, {
                headers: { token }
            });

            if (data.success) {
                // toast.success(data.message);

            } else {
                toast.error(data.message || "Could not start game");
                return
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);
        }
    };

    const makeMove = async (gameId: string, boxIndex: number) => {
        try {
            const { data } = await axios.post(`/api/game/make-move/${gameId}`, { boxIndex }, {
                headers: { token }
            });

            if (data.success) {
                setGame(data.game);

            } else {
                toast.error(data.message || "Invalid move");
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);
        }
    };

    const resetGame = async (gameId: string) => {
        try {
            const { data } = await axios.post(`/api/game/reset/${gameId}`, {}, {
                headers: { token }
            });

            if (data.success) {
                setGame(data.game);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error("Failed to reset board");
        }
    };

    const getHistory = async (user1Id: string, user2Id: string) => {
        try {
            const { data } = await axios.get(`/api/game/history/${user1Id}/${user2Id}`, {
                headers: { token }
            });

            if (data.success) {
                setHistory(data.stats);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error(errMessage);
        }
    };

    useEffect(() => {
        if (token) {
            checkAuth();
        }
    }, [token]);

    useEffect(() => {
        return () => {
            socket?.disconnect();
        };
    }, [socket]);

    const value = {
        socket, setSocket,
        authUser, setAuthUser,
        login,
        logout,
        users, setUsers,
        getUsers,
        onlineUsers, setOnlineUsers,
        selectedUser, setSelectedUser,
        game, setGame,
        makeMove,
        startGame,
        quitGame,
        resetGame,
        history, setHistory,
        getHistory
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;