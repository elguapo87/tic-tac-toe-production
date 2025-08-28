import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io, type Socket } from "socket.io-client";

type UserData = {
    _id: string;
    name: string;
    email: string;
    userImg: string;
};

interface AppContextType {
    authUser: UserData | null;
    setAuthUser: React.Dispatch<React.SetStateAction<UserData | null>>;
    login: (state: "Login" | "Sign Up", credentials: Partial<UserData> & { password: string }) => Promise<void>;
    logout: () => Promise<void>;
    users: UserData[];
    setUsers: React.Dispatch<React.SetStateAction<UserData[]>>;
    getUsers: () => Promise<void>;
    onlineUsers: string[];
    setOnlineUsers: React.Dispatch<React.SetStateAction<string[]>>;
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
                toast.error(data.message);
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
        socket?.disconnect();
        toast.success("Logged out successfully");
    };

    // Conncect socket function to handle socket connection and online users update
    const connectSocket = (userData: { _id: string }) => {
        if (!userData || socket) return;
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
        authUser, setAuthUser,
        login,
        logout,
        users, setUsers,
        getUsers,
        onlineUsers, setOnlineUsers
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;