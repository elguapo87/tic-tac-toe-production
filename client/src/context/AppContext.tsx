import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

type UserData = {
    _id: string;
    name: string;
    email: string;
    userImg: string;
};

interface AppContextType {

};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

    const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : null);
    const [authUser, setAuthUser] = useState<UserData | null>(null);

    // Function to check if user is authenticated and if so, set the user data and connect the socketto check user auth
    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check", {
                headers: { token }
            });

            if (data.success) {
                setAuthUser(data.user);

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error("checkAuth failed", error);
        }
    };

    // Login function to handle user authentication and socket connection
    const login = async (state: "Login" | "Sign Up", credentials: Partial<UserData>) => {
        try {
            const endpoint = state === "Sign Up" ? "register" : "login";

            const { data } = await axios.post(`/api/auth/${endpoint}`, credentials);

            if (data.success) {
                setAuthUser(data.userData);
                localStorage.setItem("token", data.token);
                setToken(data.token);
                toast.success(data.message);
                
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
    }, [token])

    const value = {};

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;